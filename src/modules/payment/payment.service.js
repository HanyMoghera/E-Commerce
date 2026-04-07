// src/modules/payment/payment.service.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (order) => {
  // Create a PaymentIntent with order amount and metadata
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100), // in cents
    currency: "egp", // change if needed
    payment_method_types: ["card"],
    metadata: {
      orderId: order._id.toString(),
    },
  });

  return paymentIntent.client_secret;
};
