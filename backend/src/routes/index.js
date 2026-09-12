const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const noteRoutes = require('./note.routes');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Track Box API is up and running!',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);

module.exports = router;
