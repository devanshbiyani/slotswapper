const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createEvent(req, res, next) {
  try {
    const { title, startTime, endTime, status } = req.body;
    const ev = await prisma.event.create({
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: status || 'BUSY',
        ownerId: req.user.id
      }
    });
    res.json(ev);
  } catch (err) { next(err); }
}

async function listMyEvents(req, res, next) {
  try {
    const events = await prisma.event.findMany({ where: { ownerId: req.user.id }});
    res.json(events);
  } catch (err) { next(err); }
}

async function updateEventStatus(req, res, next) {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    const ev = await prisma.event.findUnique({ where: { id: eventId }});
    if (!ev || ev.ownerId !== req.user.id) return res.status(404).json({ message: 'Event not found' });
    const updated = await prisma.event.update({ where: { id: eventId }, data: { status }});
    res.json(updated);
  } catch (err) { next(err); }
}

module.exports = { createEvent, listMyEvents, updateEventStatus };
