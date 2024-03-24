const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

const app = express();
const PORT = process.env.PORT || 3000;

// Razorpay configuration
const rzp = new Razorpay({
  key_id: 'rzp_test_wOXNcJ8Isd6Ss0',
  key_secret: 'Jm333cdLbE7PNrH6bCInxfnN'
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to generate payment link
app.post('/generatePaymentLink', async (req, res) => {
  try {
    const { plan } = req.body;

    // Log the plan data received from the request
    console.log('Plan data:', plan);

    // Check if plan data is provided
    if (!plan || !plan.name || !plan.amount || !plan.duration) {
      return res.status(400).send('Invalid plan data');
    }

    const options = {
      amount: plan.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${plan.name.toLowerCase().replace(/ /g, '_')}`,
      payment_capture: 1,
      notes: {
        subscription_plan: plan.name,
        subscription_duration: `${plan.duration} months`,
      },
    };

    const response = await rzp.orders.create(options);
    const paymentLink = response.short_url;

    return res.status(200).json({ paymentLink });
  } catch (error) {
    console.error('Error generating payment link:', error);
    return res.status(500).send('Error generating payment link');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
