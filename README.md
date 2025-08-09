<h1 align="center">Spotify Stats<h1>

<div align="center">
  <img src="public/logo.png" alt="Spotify Stats Logo" width="120">
  <h3>Listening Stats and Tops</h3>
</div>

---

## About

Spotify Stats is s web application built with React that connects to the Spotify Web API to provide detailed analytics about your music listening habits. Get insights into your top tracks, artists, and albums across different time ranges (short, medium, and long-term).

> **⚠️ Development Mode Notice**: This application is currently in Spotify's Development Mode, which means only users explicitly added to the app's user management in the Spotify Developer Dashboard can access and use the application. This is a Spotify limitation for non-commercial applications.

## Features

### **Authentication**
- Secure Spotify OAuth integration
- Seamless login experience
- Protected routes and data access

### **Music Statistics**
- **Top Artists** - Your most played artists with detailed metrics
- **Top Tracks** - Most listened songs with play counts  
- **Top Albums** - Your most listened albums
- **Liked Tracks** - Access to your last liked song
- **Time Range Analysis** - Short, medium, and long-term listening patterns

### **User Experience**
- Modern, responsive design
- Spotify-inspired theme
- Loading states and error handling
- Mobile-optimized interface

### **Features in Development**
- Advanced analytics and visualizations
- Music predictions and recommendations  
- Social sharing capabilities
- Extended statistical analysis

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**:  Bootstrap 5 + Custom CSS
- **API**: Spotify Web API
- **Build Tool**: Vite

##  Project Architecture

```
src/
├── components/auth/          # Authentication components
├── components/dashboard/     # Main dashboard layout
├── components/common/        # Reusable UI components
├── components/layouts/       # App layout and navigation
├── hooks/                    # Custom React hooks
├── services/                 # API services and data handling
├── styles/                   # Modular CSS architecture
└── utils/                    # Helper functions and constants
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Spotify Developer Account
- Spotify App registration

> **Access Requirements**: To use this application, users must be explicitly added to the Spotify app's user management in the Developer Dashboard. This is due to Spotify's Development Mode restrictions for non-commercial applications.

### Environment Setup

1. **Create a Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app and get your `Client ID`
   - Add your redirect URI to the app settings

2. **Environment Variables**
   ```bash
   # Create .env file in root directory
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_REDIRECT_URI=http://localhost:5173/callback
   ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JonaVicesar/Spotify-Stats.git
   cd Spotify-Stats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Important Limitations

### Spotify Development Mode
This application operates under Spotify's Development Mode, which means:
- **Limited User Access**: Only users manually added to the app in Spotify Developer Dashboard can use it
- **User Management**: To add users, go to your Spotify app settings → User Management → Add users by email
- **Commercial Use**: Full public access requires Spotify approval and commercial licensing
- **Maximum Users**: Limited to 25 users in development mode


### Spotify API Scopes
The app requests the following Spotify permissions:
- `user-read-private` - Access to user profile
- `user-read-email` - User email access
- `user-top-read` - Top artists and tracks
- `user-library-read` - Saved tracks access
- `playlist-read-private` - Private playlists
- `user-read-recently-played` - Recent listening history

### Customization
You can customize themes and colors by modifying:
- `src/styles/themes/spotify.css` - Main theme variables
- `src/styles/global.css` - Global styles
- Component-specific CSS files in `src/styles/components/`

## Responsive Design

- **Desktop**: Full-featured dashboard experience
- **Mobile**: Streamlined interface with essential features

## Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)

---
