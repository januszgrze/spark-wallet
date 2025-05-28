import React from 'react';

interface DepositScreenProps {
  depositAddress: string;
  copySuccess: string;
  onGenerateAddress: () => void;
  onCopyAddress: (address: string) => void;
  onBack: () => void;
}

const DepositScreen: React.FC<DepositScreenProps> = ({
  depositAddress,
  copySuccess,
  onGenerateAddress,
  onCopyAddress,
  onBack
}) => {
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
        Deposit
      </h1>

      <button className="full-width-button" onClick={onGenerateAddress}>
        Generate Address
      </button>

      {depositAddress && (
        <>
          <div
            style={{
              background: '#0B0D11',
              padding: '16px',
              borderRadius: '12px',
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              color: '#FFFFFF',
              fontSize: '14px',
              marginTop: '24px',
              textAlign: 'center'
            }}
          >
            {depositAddress}
          </div>

          <button
            className="full-width-button"
            onClick={() => onCopyAddress(depositAddress)}
            style={{ marginTop: '12px' }}
          >
            {copySuccess || 'Copy Address'}
          </button>

          <p
            style={{
              color: '#FFFFFF',
              opacity: 0.7,
              fontSize: '14px',
              marginTop: '12px',
              textAlign: 'center'
            }}
          >
            This address is for deposit only.
          </p>
        </>
      )}

      <button className="full-width-button" onClick={onBack} style={{ marginTop: '32px' }}>
        Back to Home
      </button>
    </div>
  );
};

export default DepositScreen;