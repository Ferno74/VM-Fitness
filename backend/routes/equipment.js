const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Equipment = require('../models/Equipment');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    res.json(await Equipment.find({}));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Equipment.create(req.body));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/qr', protect, adminOnly, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

    const targetUrl = `${process.env.CLIENT_URL || 'http://54.146.146.102'}/equipment/${equipment._id}`;
    const qrDataUrl = await QRCode.toDataURL(targetUrl, { width: 400, margin: 2, color: { dark: '#0A0A0A', light: '#FFFFFF' } });

    res.json({ qrDataUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code' });
  }
});

module.exports = router;
