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

  // Wallet persistence functions
  const saveWalletToStorage = (mnemonicToSave: string) => {
    try {
      localStorage.setItem('spark_wallet_mnemonic', mnemonicToSave);
      console.log('Wallet saved to localStorage');
    } catch (err) {
      console.error('Failed to save wallet to localStorage:', err);
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
        return true;
      }
    } catch (err) {
      console.error('Failed to restore wallet from localStorage:', err);
      // Clear invalid data
      localStorage.removeItem('spark_wallet_mnemonic');
    }
    return false;
  };

  const clearWalletFromStorage = () => {
    try {
      localStorage.removeItem('spark_wallet_mnemonic');
      console.log('Wallet cleared from localStorage');
    } catch (err) {
      console.error('Failed to clear wallet from localStorage:', err);
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
        saveWalletToStorage(result.mnemonic); // Save to localStorage
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
      console.error('Error sending payment:', err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleReceive = async () => {
    if (!wallet || !receiveAmount) return;
    try {
      console.log('Checking wallet state...');
      const balanceResult = await wallet.getBalance();
      console.log('Current balance:', balanceResult.balance.toString(), 'sats');

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

      console.log('Creating mainnet invoice for amount:', amount);
      const result = await wallet.createLightningInvoice({
        amountSats: amount,
        memo: `Receive ${amount} sats`
      });
      console.log('Invoice creation result:', result);

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
        console.error('Invalid response format:', result);
        setError('Failed to generate invoice: received invalid response format from the server');
        return;
      }

      console.log('Setting invoice with id:', result.id);
      setInvoice({
        id: result.id,
        paymentRequest: result.invoice.encodedInvoice,
        status: result.status || 'PENDING'
      });
      
      // Start checking payment status
      checkPaymentStatus(result.id);
    } catch (err: unknown) {
      console.error('Error generating invoice:', err);
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
      console.error('Error checking payment status:', err);
    }
  };

  const updateDepositAddress = async () => {
    if (!wallet) return;
    try {
      const address = await wallet.getSingleUseDepositAddress();
      console.log('Generated deposit address:', address);
      setDepositAddress(address);
    } catch (err: unknown) {
      console.error('Error generating deposit address:', err);
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
      console.error('Copy failed:', err);
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
      console.log('Claiming deposit with txId:', txId);
      const result = await wallet.claimDeposit(txId);
      console.log('Deposit claimed:', result);
      await updateBalance();
      setError(''); // Clear any previous errors
    } catch (err: unknown) {
      console.error('Error claiming deposit:', err);
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
      console.log('Checking for deposits to:', depositAddress);
      const txId = await getLatestDepositTxId(depositAddress);
      if (txId) {
        console.log('Found deposit transaction:', txId);
        await claimDeposit(txId);
      }
    } catch (err: unknown) {
      console.error('Error checking deposit:', err);
    }
  };

  const getSparkAddress = async () => {
    if (!wallet) return;
    try {
      const address = await wallet.getSparkAddress();
      console.log('Generated Spark address:', address);
      setSparkAddress(address);
    } catch (err: unknown) {
      console.error('Error getting Spark address:', err);
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
      const walletRestored = await loadWalletFromStorage();
      if (!walletRestored) {
        console.log('No saved wallet found, showing init screen');
      }
    };
    
    initializeApp();
  }, []);

  const renderScreen = () => {
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
            onContinueToWallet={() => setScreen('HOME')}
          />
        );
      
      case 'HOME':
        return (
          <HomeScreen
            balance={balance}
            onSendClick={() => setScreen('SEND')}
            onReceiveClick={() => setScreen('RECEIVE')}
            onDepositClick={() => setScreen('DEPOSIT')}
            onSettingsClick={() => setScreen('SETTINGS')}
            onLogoutClick={logoutWallet}
          />
        );

      case 'SEND':
        return (
          <SendScreen
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
            onCancel={() => {
              setScreen('HOME');
              setSendAmount('');
              setRecipientAddress('');
              setLightningInvoice('');
            }}
          />
        );

      case 'RECEIVE':
        return (
          <ReceiveScreen
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
            onBack={() => {
              setScreen('HOME');
              setInvoice(null);
              setReceiveAmount('');
            }}
          />
        );

      case 'DEPOSIT':
        return (
          <DepositScreen
            depositAddress={depositAddress}
            copySuccess={copySuccess}
            onGenerateAddress={updateDepositAddress}
            onCopyAddress={copyToClipboard}
            onBack={() => setScreen('HOME')}
          />
        );

      case 'SETTINGS':
        return (
          <SettingsScreen
            onViewTransfers={() => setScreen('TRANSFERS')}
            onBack={() => setScreen('HOME')}
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
    <div className="app-container">
      <div className="wallet-card">
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