import React, { useEffect } from 'react';

interface LightningInvoice {
  id: string;
  paymentRequest: string;
  status: string;
}

interface ReceiveScreenProps {
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
  onBack: () => void;
}

const ReceiveScreen: React.FC<ReceiveScreenProps> = ({
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
  onBack
}) => {
  const isSpark = receiveType === 'spark';
  const invoiceCreated = Boolean(invoice);

  useEffect(() => {
    if (isSpark && !sparkAddress) {
      onGetSparkAddress();
    }
  }, [isSpark, sparkAddress, onGetSparkAddress]);

  return (
    <>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        Receive Payment
      </h1>

      <div className="button-container">
        <button
          className={isSpark ? 'action-button active' : 'action-button'}
          onClick={() => onReceiveTypeChange('spark')}
        >
          Spark
        </button>
        <button
          className={!isSpark ? 'action-button active' : 'action-button'}
          onClick={() => onReceiveTypeChange('lightning')}
        >
          Lightning
        </button>
      </div>

      {isSpark ? (
        <>
          {sparkAddress ? (
            <div style={{ width: '100%' }}>
              <div
                style={{
                  background: '#0B0D11',
                  padding: '16px',
                  borderRadius: '12px',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  margin: '12px 0',
                  textAlign: 'left',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere'
                }}
              >
                {sparkAddress}
              </div>

              <button
                className="full-width-button"
                onClick={() => onCopySparkAddress(sparkAddress)}
                style={{ border: 'none', outline: 'none' }}
              >
                Copy Spark Address
              </button>

              {copySuccess && (
                <p
                  style={{
                    color: copySuccess === 'Copied!' ? '#00FF2B' : '#FF3B3B',
                    marginTop: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {copySuccess}
                </p>
              )}
            </div>
          ) : (
            <p style={{ color: '#CCCCCC', fontStyle: 'italic' }}>
              Loading Spark address...
            </p>
          )}
        </>
      ) : (
        <>
          {!invoiceCreated && (
            <>
              <input
                type="text"
                placeholder="Amount (sats)"
                value={receiveAmount}
                onChange={(e) => onReceiveAmountChange(e.target.value)}
              />

              <button
                className="full-width-button"
                onClick={onGenerateInvoice}
                disabled={!receiveAmount}
                style={{ border: 'none', outline: 'none' }}
              >
                Generate Invoice
              </button>
            </>
          )}

          {invoiceCreated && invoice && (
            <div style={{ width: '100%' }}>
              <p>Payment Status: {invoice.status}</p>
              <p>Share this invoice to receive {receiveAmount} sats:</p>

              <div
                style={{
                  background: '#0B0D11',
                  padding: '16px',
                  borderRadius: '12px',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  margin: '16px 0',
                  textAlign: 'left',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere'
                }}
              >
                {invoice.paymentRequest}
              </div>

              <button
                className="full-width-button"
                onClick={() => onCopyInvoice(invoice.paymentRequest)}
                style={{ border: 'none', outline: 'none' }}
              >
                Copy Invoice
              </button>

              {copySuccess && (
                <p
                  style={{
                    color: copySuccess === 'Copied!' ? '#00FF2B' : '#FF3B3B',
                    marginTop: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {copySuccess}
                </p>
              )}

              {invoice.status === 'PAID' && (
                <p style={{ color: '#00FF2B', marginTop: '12px', fontWeight: 'bold' }}>
                  Payment received!
                </p>
              )}
            </div>
          )}
        </>
      )}

      <button
        className="full-width-button"
        onClick={onBack}
        style={{
          marginTop: '24px',
          backgroundColor: '#00FF2B',
          color: '#000',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '14px',
          fontSize: '16px',
          textTransform: 'uppercase',
          border: 'none',
          outline: 'none'
        }}
      >
        BACK TO HOME
      </button>
    </>
  );
};

export default ReceiveScreen;