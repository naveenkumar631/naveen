
// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection string
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Import Subscriber model
const Subscriber = require('./subscriber');

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    try {
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        res.json({ message: 'Subscription successful', email });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
