const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Service = require("../models/service.model");

async function createCheckoutSession(req, res) {
  try {
    const { serviceId, date, time } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "npr", // or "usd"
            product_data: {
              name: service.title,
            },
            unit_amount: service.price * 100, // paisa
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/success?serviceId=${serviceId}&date=${date}&time=${time}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createCheckoutSession };
