import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    id: 'plan_basic',
    name: 'Standard Protocol',
    price: 999,
    description: 'Essential access for dedicated athletes.',
    features: [
      '24/7 Facility Access',
      'Standard Free Weights',
      'Cardio Deck Access',
      'Locker Room Access'
    ],
    popular: false
  },
  {
    id: 'plan_pro',
    name: 'Pro Protocol',
    price: 1999,
    description: 'Advanced biomechanics and intelligent tracking.',
    features: [
      'Everything in Standard',
      'Smart QR Equipment Access',
      'AI Trainer Basic Insights',
      'Recovery Lounge (Sauna)'
    ],
    popular: true
  },
  {
    id: 'plan_elite',
    name: 'Elite Ecosystem',
    price: 2999,
    description: 'The ultimate flagship experience without compromises.',
    features: [
      'Everything in Pro',
      'Unlimited Google Gemini AI Coaching',
      '1-on-1 Monthly Biomechanics Review',
      'Premium Guest Passes (2/mo)'
    ],
    popular: false
  }
];

export default function Plans() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('plan_pro'); // Default to middle plan

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast.error('Please initialize a session (login) first.');
      navigate('/login');
      return;
    }

    setProcessingId(plan.id);
    try {
      // 0. Fetch the public Razorpay Key from the backend securely
      const { data: { key } } = await api.get('/payment/key');

      // 1. Create order on our backend
      const { data: order } = await api.post('/payment/create-order', {
        planId: plan.id
      });

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: key, 
        amount: order.amount,
        currency: order.currency,
        name: 'VM Fitness',
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify signature on our backend
            await api.post('/payment/verify-signature', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id
            });
            toast.success('Subscription activated successfully. Welcome to the ecosystem.');
            window.location.href = '/dashboard';
          } catch (err) {
            toast.error('Verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#FF6B00'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize payment gateway.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white pt-24 pb-20 px-6 selection:bg-accent selection:text-white">
      
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent opacity-[0.02] blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4 text-[rgba(255,255,255,0.9)]">
            Membership Protocols
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-lg md:text-xl max-w-2xl mx-auto">
            Select your tier of access to the VM Fitness ecosystem. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative bg-[#18181B] border ${selectedPlanId === plan.id ? 'border-accent shadow-[0_0_30px_rgba(255,107,0,0.15)]' : 'border-white/10 hover:border-white/20'} rounded-3xl p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent to-yellow-500 text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/50 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-display font-bold">₹{plan.price}</span>
                <span className="text-white/40 ml-2">/ month</span>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white/70 text-sm">
                    <Check className={`w-5 h-5 shrink-0 transition-colors ${selectedPlanId === plan.id ? 'text-accent' : 'text-white/30'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlanId(plan.id);
                  handleSubscribe(plan);
                }}
                disabled={processingId === plan.id}
                className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all ${
                  selectedPlanId === plan.id 
                    ? 'bg-gradient-to-r from-accent to-yellow-500 text-black hover:opacity-90 shadow-[0_0_20px_rgba(255,107,0,0.2)]' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                }`}
              >
                {processingId === plan.id ? 'Initializing...' : 'Select Protocol'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
