const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

router.get('/youtube', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        redirect_uri: process.env.REDIRECT_URI
    });

    res.redirect(url);
});

router.get('/youtube/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken({
            code,
            redirect_uri: process.env.REDIRECT_URI
        });
        oauth2Client.setCredentials(tokens);

        console.log('Tokens:', tokens); // Log the tokens to verify

        // Save the tokens in session or database as needed
        res.send('YouTube authentication successful! You can now upload videos.');
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Authentication failed');
    }
});

module.exports = router;
