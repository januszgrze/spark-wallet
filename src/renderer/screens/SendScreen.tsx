import React from 'react';

interface SendScreenProps {
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
  onCancel: () => void;
}

const SendScreen: React.FC<SendScreenProps> = ({
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
  onCancel
}) => {
  const isSpark = sendType === 'spark';
  const canSendSpark = wallet && sendAmount && recipientAddress;
  const canSendLightning = wallet && lightningInvoice;

  return (
    <>
      <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Send Payment</h2>

      <div className="button-container">
        <button
          className={isSpark ? 'action-button active' : 'action-button'}
          onClick={() => onSendTypeChange('spark')}
        >
          Spark
        </button>
        <button
          className={!isSpark ? 'action-button active' : 'action-button'}
          onClick={() => onSendTypeChange('lightning')}
        >
          Lightning
        </button>
      </div>

      {isSpark ? (
        <>
          <input
            type="text"
            placeholder="Amount (sats)"
            value={sendAmount}
            onChange={(e) => onSendAmountChange(e.target.value)}
          />
          <input
            type="text"
            placeholder="Spark Address (sprt1...)"
            value={recipientAddress}
            onChange={(e) => onRecipientAddressChange(e.target.value)}
          />
          <button
            className="full-width-button"
            onClick={onSend}
            disabled={!canSendSpark}
          >
            Send Spark Payment
          </button>
        </>
      ) : (
        <>
          <textarea
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
            style={{ minHeight: '100px', fontFamily: 'monospace' }}
          />
          <button
            className="full-width-button"
            onClick={onSend}
            disabled={!canSendLightning}
          >
            Pay Invoice
          </button>
        </>
      )}

      <button
        className="full-width-button"
        onClick={onCancel}
        style={{ marginTop: '12px' }}
      >
        Cancel
      </button>
    </>
  );
};

export default SendScreen;