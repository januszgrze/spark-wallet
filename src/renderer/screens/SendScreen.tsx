import React from 'react';
import sparkyImg from '../assets/sparky.png';
import satsImg from '../assets/sats.png';

interface SendScreenProps {
  balance: string;
  sendType: 'spark' | 'lightning';
  sendAmount: string;
  recipientAddress: string;
  lightningInvoice: string;
  wallet: any;
  onSendTypeChange: (type: 'spark' | 'lightning') => void;
  onSendAmountChange: (amount: string) => void;
  onRecipientAddressChange: (address: string) => void;
  onLightningInvoiceChange: (invoice: string) => void;
  onSend: () => void;
  onWalletClick: () => void;
  onDepositClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

const SendScreen: React.FC<SendScreenProps> = ({
  balance,
  sendType,
  sendAmount,
  recipientAddress,
  lightningInvoice,
  wallet,
  onSendTypeChange,
  onSendAmountChange,
  onRecipientAddressChange,
  onLightningInvoiceChange,
  onSend,
  onWalletClick,
  onDepositClick,
  onSettingsClick,
  onLogoutClick
}) => {
  const formatted = balance ? balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
  const isSpark = sendType === 'spark';
  const canSendSpark = wallet && sendAmount && recipientAddress;
  const canSendLightning = wallet && lightningInvoice;

  return (
    <div className="home-screen-container">
      <div className="home-screen-background">
        {/* Sparky Logo */}
        <div className="sparky-logo">
          <img src={sparkyImg} alt="Sparky" className="sparky-image" />
        </div>

        {/* Balance Amount */}
        <div className="balance-container">
          <div className="balance-amount">{formatted}</div>
          <div className="sats-logo">
            <img src={satsImg} alt="Sats" className="sats-image" />
          </div>
        </div>

        {/* Send Content (replaces action buttons) */}
        <div className="send-content">
          <h2 className="send-title">Send Payment</h2>

          <div className="send-type-buttons">
            <button
              className={isSpark ? 'send-type-button active' : 'send-type-button'}
              onClick={() => onSendTypeChange('spark')}
            >
              Spark
            </button>
            <button
              className={!isSpark ? 'send-type-button active' : 'send-type-button'}
              onClick={() => onSendTypeChange('lightning')}
            >
              Lightning
            </button>
          </div>

          {isSpark ? (
            <div className="send-form">
              <input
                className="send-input"
                type="text"
                placeholder="Amount (sats)"
                value={sendAmount}
                onChange={(e) => onSendAmountChange(e.target.value)}
              />
              <input
                className="send-input"
                type="text"
                placeholder="Spark Address (sprt1...)"
                value={recipientAddress}
                onChange={(e) => onRecipientAddressChange(e.target.value)}
              />
              <button
                className="send-submit-button"
                onClick={onSend}
                disabled={!canSendSpark}
              >
                Send Spark Payment
              </button>
            </div>
          ) : (
            <div className="send-form">
              <textarea
                className="send-textarea"
                placeholder="Paste Lightning Invoice"
                value={lightningInvoice}
                onChange={(e) => {
                  const invoice = e.target.value;
                  onLightningInvoiceChange(invoice);

                  if (invoice.startsWith('lnbc')) {
                    try {
                      const match = invoice.match(/lnbc(\d+)/);
                      if (match && match[1]) {
                        onSendAmountChange(match[1]);
                      }
                    } catch (err) {
                      console.error('Error parsing invoice amount:', err);
                    }
                  }
                }}
              />
              <button
                className="send-submit-button"
                onClick={onSend}
                disabled={!canSendLightning}
              >
                Pay Invoice
              </button>
            </div>
          )}

        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button className="nav-button wallet-button" onClick={onWalletClick}>
            WALLET
          </button>
          <button className="nav-button deposit-button" onClick={onDepositClick}>
            DEPOSIT
          </button>
          <button className="nav-button settings-button" onClick={onSettingsClick}>
            SETTINGS
          </button>
          <button className="nav-button logout-button" onClick={onLogoutClick}>
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendScreen;