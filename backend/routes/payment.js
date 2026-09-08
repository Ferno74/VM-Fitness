const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const PLANS = { 
  plan_basic: 99900, 
  plan_pro: 199900,
  plan_elite: 299900
};

// Route to get Razorpay public key for frontend
router.get('/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

router.post('/create-order', protect, async (req, res) => {
  try {
    const { planId } = req.body;
    if (!PLANS[planId]) return res.status(400).json({ message: 'Invalid plan selected' });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({ 
      amount: PLANS[planId], 
      currency: 'INR', 
      receipt: `receipt_${Date.now()}` 
    });

    await Payment.create({ 
      userId: req.user._id, 
      razorpayOrderId: order.id, 
      plan: planId, 
      amount: PLANS[planId], 
      status: 'pending' 
    });

    res.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ message: 'Failed to create payment order.' });
  }
});

router.post('/verify-signature', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) return res.status(400).json({ message: 'Invalid payment signature' });

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'success' },
      { new: true }
    );
    
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    // Extend membership
    const user = await User.findById(req.user._id);
    let currentExpiry = user.membershipStatus === 'active' && user.membershipExpiry > Date.now() ? new Date(user.membershipExpiry) : new Date();
    currentExpiry.setDate(currentExpiry.getDate() + 30); // Adds 30 days

    user.membershipStatus = 'active';
    user.membershipType = planId.replace('plan_', ''); // "pro", "elite", etc.
    user.membershipExpiry = currentExpiry;
    await user.save();

    res.json({ success: true, message: 'Membership activated successfully!' });
  } catch (error) {
    console.error('Verify Error:', error);
    res.status(500).json({ message: 'Failed to verify payment.' });
  }
});

module.exports = router;
