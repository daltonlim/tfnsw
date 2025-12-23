# TfNSW Dashboard

A real-time dashboard for Sydney train departures, showing the next 3 trains for T4 and T8 lines.

## Features

- Real-time train departure information
- Displays next 3 trains for each direction
- Shows time until you need to leave (accounting for walk time)
- Configurable settings (walk time, station name, refresh interval)
- Station search with dropdown
- Alternating dark/light quadrants for better visual distinction

## Setup

1. Get a TfNSW API key from [Transport NSW Open Data](https://opendata.transport.nsw.gov.au/)
2. Open `index.html` in your browser

### Setting API Key

You can set the API key in two ways:

**Option 1: URL Parameter (Recommended for sharing)**
```
https://your-site.com/index.html?apiKey=your_api_key_here
```
The API key will be automatically saved to localStorage and removed from the URL.

**Option 2: Enter in Browser**
- Enter your API key when prompted (stored locally in browser)
- Or use the Settings overlay after initial setup

## Deployment to GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Select branch `main` and folder `/ (root)`
4. Your site will be available at `https://yourusername.github.io/tfnsw/`

**Note**: The app uses a free CORS proxy service. If you encounter API issues, you may need to deploy a backend proxy (see `server.js` and `vercel.json` for serverless deployment options).

## Local Development

For local development with a custom proxy:

```bash
TFNSW_KEY=your_key node server.js
```

Then open `tfnsw.html` - it will use `http://localhost:3000` automatically.

