const express = require('express');
const cors = require('cors');
const { fetchLyrics } = require('./services/lrclib');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Lyricus Lyrics API' });
});

// Get lyrics by track info
app.get('/v1/lyrics', async (req, res) => {
    try {
        const { track, artist, album, duration } = req.query;

        if (!track || !artist) {
            return res.status(400).json({
                error: 'Missing required parameters: track and artist'
            });
        }

        const lyrics = await fetchLyrics({
            trackName: track,
            artistName: artist,
            albumName: album,
            duration: duration ? parseInt(duration) : null
        });

        if (!lyrics) {
            return res.status(404).json({
                error: 'Lyrics not found',
                synced: false
            });
        }

        res.json(lyrics);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Legacy endpoint for backward compatibility
app.get('/v1/lyrics/:trackId', async (req, res) => {
    res.status(400).json({
        error: 'This endpoint requires track and artist query parameters. Use /v1/lyrics?track=...&artist=...'
    });
});

app.listen(port, () => {
    console.log(`Lyricus API running on http://localhost:${port}`);
});
