const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getSwappableSlots, createSwapRequest, respondToSwap } = require('../controllers/swapController');

router.get('/swappable-slots', auth, getSwappableSlots);
router.post('/swap-request', auth, createSwapRequest);
router.post('/swap-response/:requestId', auth, respondToSwap);

module.exports = router;
