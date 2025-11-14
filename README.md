# Lyricus

Minimal lyrics viewer for Spotify with real-time synchronization. Keep it on top while you work.

## Features

- **Time-Synced Lyrics** - Lyrics highlight in real-time as the song plays (powered by LRClib)

- **Album Art Display** - Shows current track's album artwork

- **Always On Top** - Stays visible while you work

- **Beautiful UI** - Modern, dark-themed interface with smooth animations

- **Responsive Design** - Works on various window sizes

## Prerequisites

- Node.js v14 or higher
- npm or yarn
- Spotify account (free or premium)

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/vldot/Lyricus.git
cd Lyricus
npm install
```

### 2. Configure Spotify API

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create a new app (accept terms)
3. Copy your **Client ID**
4. Click "Show Client Secret" and copy it
5. Go to **Edit Settings** → **Redirect URIs**
6. Add: `http://127.0.0.1:3000/callback`
7. Click **Save**

### 3. Create `.env` File

In the project root, create a `.env` file:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

## Usage

Run these in separate terminals:

```bash
npm run oauth-server    # Port 3000 - OAuth handler
npm run lyricus-api     # Port 3001 - Lyricus API
npm start               # Electron app
```

Done! Open Spotify and start playing.

## Troubleshooting

**Lyrics not loading?**
- Ensure lyrics API server is running on port 3001

**OAuth not working?**
- Ensure OAuth server is running on port 3000
- Clear browser cache and re-authenticate

## Future Improvements

- [ ] Automatic token refresh
- [ ] Offline lyrics caching
- [ ] Multiple lyrics source fallback
- [ ] Custom keyboard shortcuts
- [ ] Transparent overlay mode
- [ ] Click-through window option
- [ ] Manual lyrics offset adjustment
- [ ] Lyrics editing/contribution

## Credits

- **Lyrics**: [LRClib.net](https://lrclib.net/)
- **Music API**: [Spotify Web API](https://developer.spotify.com/documentation/web-api)

## License

MIT

---

**Note**: For personal use only. Comply with [Spotify's Developer Terms of Service](https://developer.spotify.com/terms).