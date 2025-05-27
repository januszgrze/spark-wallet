# Spark Wallet

A modern Bitcoin Lightning wallet built with the Spark SDK, featuring both desktop (Electron) and mobile web support.

![Spark Wallet](https://img.shields.io/badge/Bitcoin-Lightning-orange) ![React](https://img.shields.io/badge/React-18-blue) ![Electron](https://img.shields.io/badge/Electron-Latest-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### 🚀 **Dual Platform Support**
- **Desktop App**: Full-featured Electron application
- **Mobile Web**: PWA-optimized for mobile browsers with native app-like experience

### ⚡ **Lightning & Spark Payments**
- **Lightning Network**: Send and receive Lightning payments
- **Spark Payments**: Instant transfers between Spark wallets with lower fees
- **On-chain Deposits**: Bitcoin deposit address generation

### 🔐 **Security & Persistence**
- **Seed Phrase**: Standard 12-word mnemonic for wallet recovery
- **Local Storage**: Automatic wallet persistence (web version)
- **Secure Logout**: Confirmation dialogs to prevent accidental logouts

### 📱 **Mobile-First Design**
- **Responsive UI**: Optimized for mobile screens
- **PWA Support**: Install as native app on mobile devices
- **Touch Optimized**: Mobile-friendly interactions and copy functionality

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron
- **Bundler**: Webpack 5
- **Bitcoin**: Spark SDK (`@buildonspark/spark-sdk`)
- **Styling**: CSS with mobile-first responsive design

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/januszgrze/spark-demo-wallet.git
cd spark-demo-wallet

# Install dependencies
npm install

# Start desktop development
npm run dev

# Start web development (mobile)
npm run dev-web
```

## 🚀 Usage

### Desktop Application
```bash
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Start built app
```

### Mobile Web Application
```bash
npm run dev-web      # Development server (http://localhost:3001)
npm run build-web    # Build for web deployment
```

The web version will be available at:
- **Local**: http://localhost:3001
- **Network**: http://[your-ip]:3001 (for mobile testing)

## 📱 Mobile Features

### PWA Support
- Install as native app on iOS/Android
- Offline capability
- Native app-like experience

### Mobile Optimizations
- Viewport scaling for proper mobile display
- Touch-friendly copy buttons with fallback support
- iOS Safari optimizations (address bar hiding, bounce prevention)
- Prevents unwanted zoom on input focus

## 🔧 Development

### Project Structure
```
src/
├── renderer/
│   ├── screens/           # Modular screen components
│   │   ├── HomeScreen.tsx
│   │   ├── InitScreen.tsx
│   │   ├── SendScreen.tsx
│   │   ├── ReceiveScreen.tsx
│   │   └── DepositScreen.tsx
│   ├── App.tsx           # Main application logic
│   ├── index.tsx         # React entry point
│   └── styles.css        # Application styles
├── web/
│   ├── index.html        # Mobile-optimized HTML
│   └── manifest.json     # PWA manifest
└── main/                 # Electron main process
```

### Key Features Implementation

#### Wallet Persistence
- Automatic mnemonic storage in localStorage (web)
- Wallet restoration on page refresh
- Secure logout with confirmation

#### Payment Types
- **Spark Payments**: Instant wallet-to-wallet transfers
- **Lightning**: Traditional Lightning Network payments
- **Deposits**: On-chain Bitcoin deposits

#### Mobile Compatibility
- Browser polyfills for Node.js modules
- Responsive design with mobile-first approach
- PWA manifest for native app installation

## 🔐 Security Notes

- **Seed Phrases**: Stored locally, never transmitted
- **Private Keys**: Generated and managed by Spark SDK
- **Web Storage**: Uses localStorage for wallet persistence
- **HTTPS Required**: For PWA features and clipboard access

## 🌐 Deployment

### Web Deployment
1. Build the web version: `npm run build-web`
2. Deploy the `dist-web/` directory to your web server
3. Ensure HTTPS for full PWA functionality

### Desktop Distribution
1. Build the desktop app: `npm run build`
2. Package with electron-builder for distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spark SDK](https://github.com/buildonspark/spark-sdk) for Bitcoin Lightning functionality
- [Electron](https://electronjs.org/) for desktop application framework
- [React](https://reactjs.org/) for the user interface

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**⚡ Built with Spark SDK - Powering the future of Bitcoin payments** 