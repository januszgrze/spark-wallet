import React, { useState, useEffect } from 'react';
import { SparkWallet } from '@buildonspark/spark-sdk';
import { getLatestDepositTxId } from "@buildonspark/spark-sdk/utils";
import { HomeScreen, InitScreen, SendScreen, ReceiveScreen, DepositScreen, TransfersScreen, SettingsScreen } from './screens';
import './styles.css';

type WalletInstance = SparkWallet;

type Screen = 'INIT' | 'HOME' | 'SEND' | 'RECEIVE' | 'DEPOSIT' | 'SETTINGS' | 'TRANSFERS';

type LightningReceiveRequestStatus = 'CREATED' | 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';

interface LightningInvoice {
  id: string;
  paymentRequest: string;
  status: string;
}

const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletInstance | null>(null);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [screen, setScreen] = useState<Screen>('INIT');
  const [balance, setBalance] = useState<string>('0');
  const [invoice, setInvoice] = useState<LightningInvoice | null>(null);
  const [sendAmount, setSendAmount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [txHashInput, setTxHashInput] = useState<string>('');
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [seedInput, setSeedInput] = useState<string>('');
  const [sendType, setSendType] = useState<'spark' | 'lightning'>('spark');
  const [lightningInvoice, setLightningInvoice] = useState<string>('');
  const [receiveType, setReceiveType] = useState<'spark' | 'lightning'>('spark');
  const [sparkAddress, setSparkAddress] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [hasSavedWallet, setHasSavedWallet] = useState<boolean>(false);
  
  // PIN-related state
  const [showPinSetup, setShowPinSetup] = useState<boolean>(false);
  const [showPinEntry, setShowPinEntry] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [pendingMnemonic, setPendingMnemonic] = useState<string>('');
  
  // Device detection
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Wallet persistence functions
  const saveWalletToStorage = (mnemonicToSave: string) => {
    try {
      localStorage.setItem('spark_wallet_mnemonic', mnemonicToSave);
      console.log('Wallet saved to localStorage');
    } catch (err) {
      console.error('Failed to save wallet to localStorage:', err);
    }
  };

  // PIN utility functions
  const hashPin = async (pin: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + 'spark_salt'); // Add salt for security
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const saveWalletWithPin = async (mnemonicToSave: string, pin: string) => {
    try {
      const hashedPin = await hashPin(pin);
      const walletData = {
        mnemonic: mnemonicToSave,
        pinHash: hashedPin,
        timestamp: Date.now()
      };
      localStorage.setItem('spark_wallet_data', JSON.stringify(walletData));
      // Keep legacy storage for compatibility
      localStorage.setItem('spark_wallet_mnemonic', mnemonicToSave);
      console.log('Wallet saved with PIN protection');
    } catch (err) {
      console.error('Failed to save wallet with PIN:', err);
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      const walletDataStr = localStorage.getItem('spark_wallet_data');
      if (!walletDataStr) return false;
      
      const walletData = JSON.parse(walletDataStr);
      const hashedPin = await hashPin(pin);
      return hashedPin === walletData.pinHash;
    } catch (err) {
      console.error('Failed to verify PIN:', err);
      return false;
    }
  };

  const hasPinProtection = (): boolean => {
    try {
      const walletDataStr = localStorage.getItem('spark_wallet_data');
      if (!walletDataStr) return false;
      const walletData = JSON.parse(walletDataStr);
      return !!walletData.pinHash;
    } catch (err) {
      return false;
    }
  };

  const loadWalletFromStorage = async () => {
    try {
      const savedMnemonic = localStorage.getItem('spark_wallet_mnemonic');
      if (savedMnemonic) {
        console.log('Found saved wallet, restoring...');
        const result = await SparkWallet.initialize({
          mnemonicOrSeed: savedMnemonic,
          options: {
            network: 'MAINNET'
          }
        });
        
        setWallet(result.wallet as WalletInstance);
        setMnemonic(savedMnemonic);
        setScreen('HOME');
        console.log('Wallet restored from localStorage');
        setIsInitializing(false);
        setHasSavedWallet(true);
        return true;
      }
    } catch (err) {
      console.error('Failed to restore wallet from localStorage:', err);
      // Clear invalid data
      localStorage.removeItem('spark_wallet_mnemonic');
    }
    setIsInitializing(false);
    setHasSavedWallet(false);
    return false;
  };

  const clearWalletFromStorage = () => {
    try {
      localStorage.removeItem('spark_wallet_mnemonic');
      localStorage.removeItem('spark_wallet_data'); // Clear PIN data too
      console.log('Wallet cleared from localStorage');
    } catch (err) {
      console.error('Failed to clear wallet from localStorage:', err);
    }
  };

  const restoreSavedWallet = async () => {
    try {
      const savedMnemonic = localStorage.getItem('spark_wallet_mnemonic');
      if (!savedMnemonic) {
        setError('No saved wallet found');
        return;
      }

      console.log('Restoring saved wallet...');
      const result = await SparkWallet.initialize({
        mnemonicOrSeed: savedMnemonic,
        options: {
          network: 'MAINNET'
        }
      });
      
      setWallet(result.wallet as WalletInstance);
      setMnemonic(savedMnemonic);
      setScreen('HOME');
      console.log('Saved wallet restored successfully');
    } catch (err: unknown) {
      console.error('Failed to restore saved wallet:', err);
      if (err instanceof Error) {
        setError(`Failed to restore saved wallet: ${err.message}`);
      } else {
        setError('An unknown error occurred while restoring saved wallet');
      }
      // Clear invalid saved data
      localStorage.removeItem('spark_wallet_mnemonic');
      setHasSavedWallet(false);
    }
  };

  const clearSavedWallet = () => {
    if (window.confirm('Are you sure you want to clear the saved wallet data?')) {
      clearWalletFromStorage();
      setHasSavedWallet(false);
      console.log('Saved wallet data cleared');
    }
  };

  const logoutWallet = () => {
    if (window.confirm('Are you sure you want to logout? You will need your seed phrase to restore your wallet.')) {
      clearWalletFromStorage();
      setWallet(null);
      setMnemonic('');
      setBalance('0');
      setScreen('INIT');
      setError('');
      // Clear other sensitive state
      setInvoice(null);
      setSparkAddress('');
      setDepositAddress('');
    }
  };

  const initializeWallet = async () => {
    try {
      console.log('Initializing wallet with MAINNET configuration...');
      const result = await SparkWallet.initialize({
        options: {
          network: 'MAINNET'
        }
      });
      
      console.log('Wallet initialization result:', {
        initialized: !!result.wallet,
        hasMnemonic: !!result.mnemonic
      });
      
      setWallet(result.wallet as WalletInstance);
      if (result.mnemonic) {
        setMnemonic(result.mnemonic);
        setPendingMnemonic(result.mnemonic);
        // Don't show PIN setup immediately - let user see mnemonic first
        // PIN setup will be triggered when they click "Continue to Wallet"
      }
    } catch (err: unknown) {
      console.error('Wallet initialization error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const restoreWallet = async () => {
    try {
      console.log('Restoring wallet with MAINNET configuration...');
      const result = await SparkWallet.initialize({
        mnemonicOrSeed: seedInput,
        options: {
          network: 'MAINNET'
        }
      });
      
      console.log('Wallet restoration result:', {
        initialized: !!result.wallet
      });
      
      setWallet(result.wallet as WalletInstance);
      setMnemonic(seedInput);
      saveWalletToStorage(seedInput); // Save to localStorage
      setScreen('HOME');
      setSeedInput('');
      setIsRestoring(false);
    } catch (err: unknown) {
      console.error('Wallet restoration error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while restoring the wallet');
      }
    }
  };

  const updateBalance = async () => {
    if (!wallet) return;
    try {
      const balanceResult = await wallet.getBalance();
      setBalance(balanceResult.balance.toString());
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleSend = async () => {
    if (!wallet) return;
    try {
      if (sendType === 'spark') {
        if (!sendAmount || !recipientAddress) return;
        await wallet.transfer({
          receiverSparkAddress: recipientAddress,
          amountSats: parseInt(sendAmount),
        });
      } else {
        if (!lightningInvoice) return;
        // Default max fee of 1% of payment amount
        const maxFeeSats = Math.ceil(parseInt(sendAmount) * 0.01);
        await wallet.payLightningInvoice({
          invoice: lightningInvoice,
          maxFeeSats
        });
      }
      await updateBalance();
      setScreen('HOME');
      setSendAmount('');
      setRecipientAddress('');
      setLightningInvoice('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleReceive = async () => {
    if (!wallet || !receiveAmount) return;
    try {
      const balanceResult = await wallet.getBalance();

      const amount = parseInt(receiveAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount greater than 0');
        return;
      }

      // Check if wallet has minimum required balance
      if (balanceResult.balance < 1000) { // 1000 sats minimum recommended
        setError(`Insufficient balance to create invoice. Please add some funds first.`);
        return;
      }

      const result = await wallet.createLightningInvoice({
        amountSats: amount,
        memo: `Receive ${amount} sats`
      });

      // Type check the response
      const hasValidFormat = 
        typeof result === 'object' &&
        result !== null &&
        'id' in result &&
        'invoice' in result &&
        typeof result.id === 'string' &&
        result.invoice &&
        typeof result.invoice.encodedInvoice === 'string';

      if (!hasValidFormat) {
        setError('Failed to generate invoice: received invalid response format from the server');
        return;
      }

      setInvoice({
        id: result.id,
        paymentRequest: result.invoice.encodedInvoice,
        status: result.status || 'PENDING'
      });
      
      // Start checking payment status
      checkPaymentStatus(result.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to generate invoice: ${err.message}`);
      } else {
        setError('An unknown error occurred while generating invoice');
      }
    }
  };

  const checkPaymentStatus = async (invoiceId: string) => {
    if (!wallet) return;
    try {
      const status = await wallet.getLightningReceiveRequest(invoiceId);
      if (status) {
        setInvoice(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: status.status
          };
        });
        
        // If payment is not in a final state, check again in 2 seconds
        if (status.status.toUpperCase() === 'PENDING') {
          setTimeout(() => checkPaymentStatus(invoiceId), 2000);
        } else if (status.status.toUpperCase() === 'PAID') {
          // Update balance when payment is received
          updateBalance();
        }
      }
    } catch (err: unknown) {
    }
  };

  const updateDepositAddress = async () => {
    if (!wallet) return;
    try {
      const address = await wallet.getSingleUseDepositAddress();
      setDepositAddress(address);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      // First try the modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
        return;
      }
      
      // Fallback for mobile browsers and non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make the textarea invisible but still selectable
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');
      
      document.body.appendChild(textArea);
      
      // For mobile devices, we need to handle selection differently
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // iOS specific selection
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        textArea.setSelectionRange(0, 999999);
      } else {
        // Android and other mobile devices
        textArea.select();
        textArea.setSelectionRange(0, 999999);
      }
      
      // Try to copy using execCommand
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      } else {
        throw new Error('Copy command failed');
      }
      
    } catch (err) {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const claimDeposit = async (txId: string) => {
    if (!wallet) {
      setError('Wallet not initialized');
      return;
    }
    
    try {
      const result = await wallet.claimDeposit(txId);
      await updateBalance();
      setError(''); // Clear any previous errors
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to claim deposit: ${err.message}`);
      } else {
        setError('An unknown error occurred while claiming deposit');
      }
    }
  };

  const checkAndClaimDeposit = async () => {
    if (!wallet || !depositAddress) return;
    try {
      const txId = await getLatestDepositTxId(depositAddress);
      if (txId) {
        await claimDeposit(txId);
      }
    } catch (err: unknown) {
    }
  };

  const getSparkAddress = async () => {
    if (!wallet) return;
    try {
      const address = await wallet.getSparkAddress();
      setSparkAddress(address);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (wallet) {
      updateBalance();
      updateDepositAddress();
      getSparkAddress(); // Get Spark address when wallet is ready
    }
  }, [wallet]);

  // Add periodic check for deposits
  useEffect(() => {
    if (wallet && depositAddress) {
      const interval = setInterval(checkAndClaimDeposit, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [wallet, depositAddress]);

  // Check for saved wallet on app startup
  useEffect(() => {
    const initializeApp = async () => {
      console.log('App starting up, checking for saved wallet...');
      
      // Always start at init screen
      setIsInitializing(false);
      setScreen('INIT');
      
      // Check if there's a saved wallet but don't auto-restore
      const savedMnemonic = localStorage.getItem('spark_wallet_mnemonic');
      const savedWalletData = localStorage.getItem('spark_wallet_data');
      
      if (savedWalletData || savedMnemonic) {
        console.log('Found saved wallet - user can choose to restore from init screen');
        setHasSavedWallet(true);
      } else {
        console.log('No saved wallet found');
        setHasSavedWallet(false);
      }
    };
    
    initializeApp();
  }, []);

  // PIN handling functions
  const handleSetPin = async (pin: string) => {
    try {
      if (pendingMnemonic) {
        await saveWalletWithPin(pendingMnemonic, pin);
        setShowPinSetup(false);
        setPinInput('');
        setPendingMnemonic('');
        setScreen('HOME'); // Navigate to home screen after PIN is set
        console.log('PIN set successfully');
      }
    } catch (err) {
      console.error('Failed to set PIN:', err);
      setPinError('Failed to set PIN. Please try again.');
    }
  };

  const handleVerifyPin = async (pin: string) => {
    try {
      const isValid = await verifyPin(pin);
      if (isValid) {
        // PIN is correct, restore the wallet
        const walletDataStr = localStorage.getItem('spark_wallet_data');
        if (walletDataStr) {
          const walletData = JSON.parse(walletDataStr);
          const result = await SparkWallet.initialize({
            mnemonicOrSeed: walletData.mnemonic,
            options: {
              network: 'MAINNET'
            }
          });
          
          setWallet(result.wallet as WalletInstance);
          setMnemonic(walletData.mnemonic);
          setScreen('HOME');
          setShowPinEntry(false);
          setPinInput('');
          setPinError('');
          console.log('Wallet restored with PIN verification');
        }
      } else {
        setPinError('Incorrect PIN. Please try again.');
      }
    } catch (err) {
      console.error('Failed to verify PIN:', err);
      setPinError('Failed to verify PIN. Please try again.');
    }
  };

  const handlePinCancel = () => {
    setShowPinSetup(false);
    setShowPinEntry(false);
    setPinInput('');
    setPinError('');
    setPendingMnemonic('');
  };

  const startSavedWalletRestore = () => {
    if (hasPinProtection()) {
      setShowPinEntry(true);
    } else {
      // Legacy wallet without PIN - restore directly
      restoreSavedWallet();
    }
  };

  const renderScreen = () => {
    // Show loading while checking for saved wallet
    if (isInitializing) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '200px'
        }}>
          <div style={{ 
            fontSize: '18px', 
            marginBottom: '16px',
            color: '#FFFFFF'
          }}>
            Loading...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #00FF2B',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      );
    }

    switch (screen) {
      case 'INIT':
        return (
          <InitScreen
            isRestoring={isRestoring}
            mnemonic={mnemonic}
            seedInput={seedInput}
            onInitializeWallet={initializeWallet}
            onStartRestore={() => setIsRestoring(true)}
            onRestoreWallet={restoreWallet}
            onCancelRestore={() => {
              setIsRestoring(false);
              setSeedInput('');
            }}
            onSeedInputChange={setSeedInput}
            onContinueToWallet={() => {
              // If we have a pending mnemonic (just created), set up PIN first
              if (pendingMnemonic) {
                setShowPinSetup(true);
              } else {
                // Otherwise go directly to wallet
                setScreen('HOME');
              }
            }}
            onCopyMnemonic={copyToClipboard}
            copySuccess={copySuccess}
            hasSavedWallet={hasSavedWallet}
            onRestoreSavedWallet={startSavedWalletRestore}
            onClearSavedWallet={clearSavedWallet}
            // PIN-related props
            showPinSetup={showPinSetup}
            showPinEntry={showPinEntry}
            pinInput={pinInput}
            onPinInputChange={setPinInput}
            onSetPin={handleSetPin}
            onVerifyPin={handleVerifyPin}
            onCancelPin={handlePinCancel}
            pinError={pinError}
          />
        );
      
      case 'HOME':
        return (
          <HomeScreen
            balance={balance}
            onSendClick={() => setScreen('SEND')}
            onReceiveClick={() => setScreen('RECEIVE')}
            onWalletClick={() => setScreen('HOME')}
            onDepositClick={() => setScreen('DEPOSIT')}
            onSettingsClick={() => setScreen('SETTINGS')}
            onLogoutClick={logoutWallet}
          />
        );

      case 'SEND':
        return (
          <SendScreen
            balance={balance}
            sendType={sendType}
            sendAmount={sendAmount}
            recipientAddress={recipientAddress}
            lightningInvoice={lightningInvoice}
            wallet={wallet}
            onSendTypeChange={setSendType}
            onSendAmountChange={setSendAmount}
            onRecipientAddressChange={setRecipientAddress}
            onLightningInvoiceChange={setLightningInvoice}
            onSend={handleSend}
            onWalletClick={() => {
              setScreen('HOME');
              setSendAmount('');
              setRecipientAddress('');
              setLightningInvoice('');
            }}
            onDepositClick={() => setScreen('DEPOSIT')}
            onSettingsClick={() => setScreen('SETTINGS')}
            onLogoutClick={logoutWallet}
          />
        );

      case 'RECEIVE':
        return (
          <ReceiveScreen
            balance={balance}
            receiveType={receiveType}
            receiveAmount={receiveAmount}
            invoice={invoice}
            sparkAddress={sparkAddress}
            copySuccess={copySuccess}
            onReceiveTypeChange={setReceiveType}
            onReceiveAmountChange={setReceiveAmount}
            onGenerateInvoice={handleReceive}
            onGetSparkAddress={getSparkAddress}
            onCopyInvoice={copyToClipboard}
            onCopySparkAddress={copyToClipboard}
            onWalletClick={() => {
              setScreen('HOME');
              setInvoice(null);
              setReceiveAmount('');
            }}
            onDepositClick={() => setScreen('DEPOSIT')}
            onSettingsClick={() => setScreen('SETTINGS')}
            onLogoutClick={logoutWallet}
          />
        );

      case 'DEPOSIT':
        return (
          <DepositScreen
            balance={balance}
            depositAddress={depositAddress}
            copySuccess={copySuccess}
            onGenerateAddress={updateDepositAddress}
            onCopyAddress={copyToClipboard}
            onWalletClick={() => setScreen('HOME')}
            onDepositClick={() => setScreen('DEPOSIT')}
            onSettingsClick={() => setScreen('SETTINGS')}
            onLogoutClick={logoutWallet}
          />
        );

      case 'SETTINGS':
        return (
          <SettingsScreen
            balance={balance}
            onViewTransfers={() => setScreen('TRANSFERS')}
            onWalletClick={() => setScreen('HOME')}
            onDepositClick={() => setScreen('DEPOSIT')}
            onSettingsClick={() => setScreen('SETTINGS')}
            onLogoutClick={logoutWallet}
          />
        );

      case 'TRANSFERS':
        return (
          <TransfersScreen
            wallet={wallet}
            onBack={() => setScreen('SETTINGS')}
          />
        );
    }
  };

  return (
    <div className={`app-container ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className={`wallet-card ${isMobile ? 'mobile' : 'desktop'}`}>
        {renderScreen()}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 