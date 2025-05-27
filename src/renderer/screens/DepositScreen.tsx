import React from 'react';

interface DepositScreenProps {
  depositAddress: string;
  onGenerateAddress: () => void;
  onBack: () => void;
}

const DepositScreen: React.FC<DepositScreenProps> = ({
  depositAddress,
  onGenerateAddress,
  onBack
}) => {
  return (
    <>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>
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
              textAlign: 'center',
              width: '100%'
            }}
          >
            {depositAddress}
          </div>

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
    </>
  );
};

export default DepositScreen;