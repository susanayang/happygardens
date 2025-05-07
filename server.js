require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/send-flower', (req, res) => {
    const { email, message } = req.body;
    console.log(email, message);

    const msg = {
        to: email,
        from: 'happygarden651@gmail.com',
        subject: 'A Flower from Happy Garden 🌸',
        text: message || 'Here’s a flower from the Happy Garden!',
        html: `<p>${message || 'Here’s a flower from the Happy Garden!'}</p>`,
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
            res.status(200).json({ success: true });
        })
        .catch((error) => {
            console.error('Send error:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
