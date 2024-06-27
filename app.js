// Import required modules
const express = require('express');
const bodyParser = require('body-parser'); // To parse request body
const mongoose = require('mongoose'); // MongoDB ORM

// Create an instance of Express app
const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());


require('dotenv').config();


// MongoDB connection string
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for email subscribers
const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Define a model for email subscribers
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Define a route to handle email subscriptions
app.post('/subscribe', async (req, res) => {
    // Extract email from request body
    const { email } = req.body;

    try {
        // Save the email to MongoDB
        const subscriber = new Subscriber({ email });
        await subscriber.save();
        // Send response back to the client
        res.json({ message: 'Subscription successful', email });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to subscribe. Please try again later.' });
    }
});

// Allow POST requests to /subscribe
app.options('/subscribe', (req, res) => {
    res.header('Allow', 'POST').status(200).end();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});