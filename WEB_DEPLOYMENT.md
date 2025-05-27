# Web Deployment Guide

This guide explains how to run and deploy the Spark Wallet as a web application compatible with mobile browsers, including iPhone Safari.

## Development

### Run Web Version Locally
```bash
npm run dev-web
```

This will start the web version on `http://localhost:3001`. The server is configured to accept connections from any device on your network, so you can test on your phone by visiting `http://YOUR_COMPUTER_IP:3001`.

### Build for Production
```bash
npm run build-web
```

This creates a production build in the `dist-web` directory.

## Mobile Compatibility Features

### iPhone Safari Optimizations
- **Viewport Configuration**: Prevents zooming and ensures proper scaling
- **PWA Support**: Can be installed as a web app on the home screen
- **Touch Optimizations**: Prevents text selection and unwanted touch behaviors
- **Address Bar Hiding**: Maximizes screen real estate on mobile
- **Input Zoom Prevention**: Prevents Safari from zooming when focusing inputs

### PWA Features
- **Manifest File**: Enables "Add to Home Screen" functionality
- **Standalone Mode**: Runs without browser UI when installed
- **Theme Colors**: Matches your app's dark theme
- **Icons**: Ready for app icons (you'll need to add actual icon files)

## Testing on iPhone

1. Start the development server: `npm run dev-web`
2. Find your computer's IP address
3. On your iPhone, open Safari and go to `http://YOUR_IP:3001`
4. Test the app functionality
5. To test PWA features, tap the share button and select "Add to Home Screen"

## Deployment Options

### Static Hosting (Recommended)
Deploy the `dist-web` folder to any static hosting service:
- **Vercel**: `vercel --prod dist-web`
- **Netlify**: Drag and drop the `dist-web` folder
- **GitHub Pages**: Push the `dist-web` contents to a gh-pages branch
- **AWS S3**: Upload the `dist-web` contents to an S3 bucket

### Server Requirements
- HTTPS is required for PWA features and some mobile APIs
- Proper MIME types for `.json` files
- Gzip compression recommended for better performance

## Notes

- All existing functionality is preserved
- No styling changes were made
- The app uses the same React components as the desktop version
- Mobile-specific optimizations are handled at the HTML/CSS level
- The wallet functionality works the same on mobile and desktop 