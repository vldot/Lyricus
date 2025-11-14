const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = 'http://127.0.0.1:3000/callback';

// Token exchange endpoint
app.post('/api/token', (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'No authorization code' });
    }

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
    });

    const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': params.toString().length
        }
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
            try {
                const result = JSON.parse(data);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: 'Failed to parse token response' });
            }
        });
    });

    request.on('error', error => {
        console.error('Token request error:', error);
        res.status(500).json({ error: 'Token request failed' });
    });

    request.write(params.toString());
    request.end();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/callback', (req, res) => {
    res.sendFile(path.join(__dirname, 'callback.html'));
});

app.listen(port, () => {
    console.log(`OAuth server is running on http://127.0.0.1:${port}`);
});