const https = require('https');
const { parseLRC } = require('../utils/lrcParser');

const LRCLIB_API = 'https://lrclib.net/api';

/**
 * Fetch lyrics from LRClib.net
 * @param {Object} params - Search parameters
 * @param {string} params.trackName - Track name
 * @param {string} params.artistName - Artist name
 * @param {string} [params.albumName] - Album name (optional)
 * @param {number} [params.duration] - Track duration in seconds (optional)
 * @returns {Promise<Object|null>} Lyrics data or null
 */
async function fetchLyrics({ trackName, artistName, albumName, duration }) {
    return new Promise((resolve, reject) => {
        // Build query parameters
        const params = new URLSearchParams({
            track_name: trackName,
            artist_name: artistName
        });

        if (albumName) {
            params.append('album_name', albumName);
        }

        if (duration) {
            params.append('duration', Math.floor(duration / 1000)); // Convert ms to seconds
        }

        const url = `${LRCLIB_API}/get?${params.toString()}`;

        console.log(`Fetching lyrics from LRClib: ${trackName} - ${artistName}`);

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 404) {
                    console.log('Lyrics not found on LRClib');
                    resolve(null);
                    return;
                }

                if (res.statusCode !== 200) {
                    console.error(`LRClib API error: ${res.statusCode}`);
                    resolve(null);
                    return;
                }

                try {
                    const result = JSON.parse(data);

                    // Check if we have synced lyrics
                    if (result.syncedLyrics) {
                        const parsed = parseLRC(result.syncedLyrics);
                        resolve({
                            synced: true,
                            lines: parsed,
                            plainLyrics: result.plainLyrics || result.syncedLyrics,
                            source: 'lrclib'
                        });
                    } else if (result.plainLyrics) {
                        // Fall back to plain lyrics
                        resolve({
                            synced: false,
                            lines: result.plainLyrics.split('\n').map(text => ({ text })),
                            plainLyrics: result.plainLyrics,
                            source: 'lrclib'
                        });
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.error('Error parsing LRClib response:', error);
                    resolve(null);
                }
            });
        }).on('error', (error) => {
            console.error('Error fetching from LRClib:', error);
            reject(error);
        });
    });
}
 
module.exports = { fetchLyrics };
