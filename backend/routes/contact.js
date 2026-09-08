const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await ContactMessage.create({ name, email, message });

    // Optional: Send email notification
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });

      transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `📬 New Contact Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      }).catch(console.error);
    }

    res.status(201).json({ success: true, message: 'Message sent', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    res.json(await ContactMessage.find({}).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Not found' });
    
    message.status = req.body.status;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
