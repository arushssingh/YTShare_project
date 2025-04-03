const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Ensure the OAuth2 client is authenticated
oauth2Client.setCredentials({
    access_token: '',
    refresh_token: '',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
    token_type: 'Bearer',
    expiry_date: 1484314697598
});

const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('video'), async (req, res) => {
    const { path: filePath, originalname } = req.file;
    const { title, description } = req.body;

    const fileSize = fs.statSync(filePath).size;

    try {
        const response = await youtube.videos.insert({
            part: 'snippet,status',
            notifySubscribers: false,
            requestBody: {
                snippet: {
                    title,
                    description
                },
                status: {
                    privacyStatus: 'private'
                }
            },
            media: {
                body: fs.createReadStream(filePath)
            }
        }, {
            onUploadProgress: (evt) => {
                const progress = (evt.bytesRead / fileSize) * 100;
                console.log(`Upload progress: ${progress.toFixed(2)}%`);
            }
        });

        console.log('Video uploaded successfully:', response.data);
        res.send('Video uploaded successfully');
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).send('Error uploading video');
    } finally {
        fs.unlinkSync(filePath); // Clean up the uploaded file
    }
});

module.exports = router;
