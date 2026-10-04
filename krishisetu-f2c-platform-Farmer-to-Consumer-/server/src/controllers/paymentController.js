const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// ADD YOUR STRIPE SECRET KEY HERE (in .env as STRIPE_SECRET_KEY)
const createCheckoutSession = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.product?.name || 'Product',
          images: item.product?.image
            ? [
                `${process.env.SERVER_URL || 'http://localhost:5000'}${item.product.image}`,
              ]
            : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Delivery Fee' },
        unit_amount: 3000,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        deliveryAddress: JSON.stringify(deliveryAddress),
      },
    });

    res.json({
      success: true,
      data: { sessionId: session.id, url: session.url },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      res.json({
        success: true,
        message: 'Payment verified',
        data: { paid: true, session },
      });
    } else {
      res.json({
        success: false,
        message: 'Payment not completed',
        data: { paid: false },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMandiPrices = async (req, res) => {
  try {
    const { getAllMandiPrices } = require('../utils/mockMandiData');
    const { state } = req.query;
    const prices = getAllMandiPrices(state);
    res.json({ success: true, data: prices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCheckoutSession, verifyPayment, getMandiPrices };
