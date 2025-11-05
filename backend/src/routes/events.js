const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { createEvent, listMyEvents, updateEventStatus } = require('../controllers/eventController');

router.use(auth);
router.post('/', createEvent);
router.get('/', listMyEvents);
router.patch('/:eventId/status', updateEventStatus);

module.exports = router;
