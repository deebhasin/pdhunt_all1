const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 50000,
          },
          quantity: 5,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/api/order/success`,

      //   "http://localhost:3004/api/order/success",

      cancel_url: "http://localhost:3004/api/order/cancel",
    });
    console.log(session);
    res.send(session.url);
    // res.redirect(303, session.url);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.success = async (req, res, next) => {
  try {
    console.log(req);
    res.send("Payment Success" + req);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
