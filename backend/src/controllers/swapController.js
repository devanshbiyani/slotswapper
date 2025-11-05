const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { emitToUser } = require('./websocket');

async function getSwappableSlots(req, res, next) {
  try {
    const slots = await prisma.event.findMany({
      where: {
        status: 'SWAPPABLE',
        NOT: { ownerId: req.user.id }
      },
      include: { owner: { select: { id: true, name: true } } }
    });
    res.json(slots);
  } catch (err) { next(err); }
}

async function createSwapRequest(req, res, next) {
  try {
    const { mySlotId, theirSlotId } = req.body;
    const mySlot = await prisma.event.findUnique({ where: { id: mySlotId }});
    const theirSlot = await prisma.event.findUnique({ where: { id: theirSlotId }});
    if (!mySlot || !theirSlot) return res.status(404).json({ message: 'Slot not found' });
    if (mySlot.ownerId !== req.user.id) return res.status(403).json({ message: 'Not owner of mySlot' });
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });

    const swap = await prisma.swapRequest.create({
      data: {
        offeredEventId: mySlot.id,
        requestedEventId: theirSlot.id,
        requesterId: req.user.id,
        responderId: theirSlot.ownerId
      }
    });
    await prisma.event.updateMany({
      where: { id: { in: [mySlot.id, theirSlot.id] } },
      data: { status: 'SWAP_PENDING', swapRequestId: swap.id }
    });

    emitToUser(theirSlot.ownerId, { type: 'swap_request', data: swap });

    res.json(swap);
  } catch (err) { next(err); }
}

async function respondToSwap(req, res, next) {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;
    const swap = await prisma.swapRequest.findUnique({
      where: { id: requestId },
      include: { offeredEvent: true, requestedEvent: true }
    });
    if (!swap) return res.status(404).json({ message: 'Swap request not found' });
    if (swap.responderId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    if (!accept) {
      await prisma.swapRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' }});
      await prisma.event.updateMany({
        where: { id: { in: [swap.offeredEventId, swap.requestedEventId] } },
        data: { status: 'SWAPPABLE', swapRequestId: null }
      });
      emitToUser(swap.requesterId, { type: 'swap_rejected', data: { id: requestId }});
      return res.json({ message: 'Rejected' });
    }

    await prisma.$transaction(async (tx) => {
      const offered = await tx.event.findUnique({ where: { id: swap.offeredEventId }});
      const requested = await tx.event.findUnique({ where: { id: swap.requestedEventId }});
      if (!offered || !requested) throw new Error('Event missing');

      await tx.event.update({ where: { id: offered.id }, data: { ownerId: requested.ownerId, status: 'BUSY', swapRequestId: null }});
      await tx.event.update({ where: { id: requested.id }, data: { ownerId: offered.ownerId, status: 'BUSY', swapRequestId: null }});
      await tx.swapRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' }});
    });

    emitToUser(swap.requesterId, { type: 'swap_accepted', data: { id: requestId }});
    return res.json({ message: 'Accepted' });
  } catch (err) { next(err); }
}

module.exports = { getSwappableSlots, createSwapRequest, respondToSwap };
