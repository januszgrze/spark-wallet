# Sparky, a reckless demo wallet built with the Spark SDK

A modern Bitcoin Lightning wallet built with the Spark SDK, featuring both web browser and mobile web support.

*This is a reckless application I made with [Cursor AI](https://cursor.com). There are most certainly bugs in this application. It is not audited. Do not use deposit funds into this wallet you are not willing to use. The wallet works with onchain deposits, Spark payments, and LN. To use LN, you must have over 1000 sats in the wallet. To add sats, generate an onchain address and send funds there. Spark payments can be spent immediately and for any amount. If you receive a payment, refresh the application and it'll show up.*

![Spark Wallet](https://img.shields.io/badge/Bitcoin-Lightning-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ⚡ Features

### **Dual Platform Support**
- **Web Browser**: A simple in-browser web wallet
- **Mobile Web**: A simple in-browser web wallet fitted for mobile phones

### **Lightning & Spark Payments**
- **Spark Payments**: Instant transfers between Spark wallets with lower fees
- **Lightning Network**: Send and receive Lightning payments
- **On-chain Deposits**: Bitcoin deposit address generation

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
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
- [React](https://reactjs.org/) for the user interface

---

**⚡ Built with Spark SDK - Powering the future of Bitcoin payments** 
