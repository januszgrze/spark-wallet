import React, { useEffect } from 'react';
import sparkyImg from '../assets/sparky.png';
import satsImg from '../assets/sats.png';

interface LightningInvoice {
  id: string;
  paymentRequest: string;
  status: string;
}

interface ReceiveScreenProps {
  balance: string;
  receiveType: 'spark' | 'lightning';
  receiveAmount: string;
  invoice: LightningInvoice | null;
  sparkAddress: string;
  copySuccess: string;
  onReceiveTypeChange: (type: 'spark' | 'lightning') => void;
  onReceiveAmountChange: (amount: string) => void;
  onGenerateInvoice: () => void;
  onGetSparkAddress: () => void;
  onCopyInvoice: (invoice: string) => void;
  onCopySparkAddress: (address: string) => void;
  onWalletClick: () => void;
  onDepositClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

const ReceiveScreen: React.FC<ReceiveScreenProps> = ({
  balance,
  receiveType,
  receiveAmount,
  invoice,
  sparkAddress,
  copySuccess,
  onReceiveTypeChange,
  onReceiveAmountChange,
  onGenerateInvoice,
  onGetSparkAddress,
  onCopyInvoice,
  onCopySparkAddress,
  onWalletClick,
  onDepositClick,
  onSettingsClick,
  onLogoutClick
}) => {
  const formatted = balance ? balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
  const isSpark = receiveType === 'spark';
  const invoiceCreated = Boolean(invoice);

  useEffect(() => {
    if (isSpark && !sparkAddress) {
      onGetSparkAddress();
    }
  }, [isSpark, sparkAddress, onGetSparkAddress]);

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

        {/* Receive Content (replaces action buttons) */}
        <div className="receive-content">
          <h2 className="receive-title">Receive Payment</h2>

          <div className="receive-type-buttons">
            <button
              className={isSpark ? 'receive-type-button active' : 'receive-type-button'}
              onClick={() => onReceiveTypeChange('spark')}
            >
              Spark
            </button>
            <button
              className={!isSpark ? 'receive-type-button active' : 'receive-type-button'}
              onClick={() => onReceiveTypeChange('lightning')}
            >
              Lightning
            </button>
          </div>

          {isSpark ? (
            <div className="receive-form">
              {sparkAddress ? (
                <>
                  <div className="receive-address">
                    {sparkAddress}
                  </div>

                  <button
                    className="receive-copy-button"
                    onClick={() => onCopySparkAddress(sparkAddress)}
                  >
                    Copy Spark Address
                  </button>

                  {copySuccess && (
                    <p className="receive-success-message">
                      {copySuccess}
                    </p>
                  )}
                </>
              ) : (
                <p className="receive-loading">Loading Spark address...</p>
              )}
            </div>
          ) : (
            <div className="receive-form">
              {!invoiceCreated && (
                <>
                  <input
                    className="receive-input"
                    type="text"
                    placeholder="Amount (sats)"
                    value={receiveAmount}
                    onChange={(e) => onReceiveAmountChange(e.target.value)}
                  />

                  <button
                    className="receive-generate-button"
                    onClick={onGenerateInvoice}
                    disabled={!receiveAmount}
                  >
                    Generate Invoice
                  </button>
                </>
              )}

              {invoiceCreated && invoice && (
                <>
                  <p className="receive-status">Payment Status: {invoice.status}</p>
                  <p className="receive-instruction">Share this invoice to receive {receiveAmount} sats:</p>

                  <div className="receive-invoice">
                    {invoice.paymentRequest}
                  </div>

                  <button
                    className="receive-copy-button"
                    onClick={() => onCopyInvoice(invoice.paymentRequest)}
                  >
                    Copy Invoice
                  </button>

                  {copySuccess && (
                    <p className="receive-success-message">
                      {copySuccess}
                    </p>
                  )}

                  {invoice.status === 'PAID' && (
                    <p className="receive-paid-message">
                      Payment received!
                    </p>
                  )}
                </>
              )}
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

export default ReceiveScreen;