import React from 'react';

interface InitScreenProps {
  isRestoring: boolean;
  mnemonic: string;
  seedInput: string;
  onInitializeWallet: () => void;
  onStartRestore: () => void;
  onRestoreWallet: () => void;
  onCancelRestore: () => void;
  onSeedInputChange: (value: string) => void;
  onContinueToWallet: () => void;
}

const InitScreen: React.FC<InitScreenProps> = ({
  isRestoring,
  mnemonic,
  seedInput,
  onInitializeWallet,
  onStartRestore,
  onRestoreWallet,
  onCancelRestore,
  onSeedInputChange,
  onContinueToWallet
}) => {
  return (
    <div className="wallet-card" style={{ justifyContent: 'flex-start' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
        Wallet Setup
      </h2>

      {!isRestoring ? (
        <>
          <button className="full-width-button" onClick={onInitializeWallet}>
            Create New Wallet
          </button>

          <button className="full-width-button" onClick={onStartRestore} style={{ marginTop: '16px' }}>
            Restore Existing Wallet
          </button>

          {mnemonic && (
            <div style={{ marginTop: '32px', width: '100%' }}>
              <p style={{ marginBottom: '12px' }}>
                Please save your mnemonic phrase in a secure location:
              </p>
              <div
                style={{
                  background: '#0B0D11',
                  padding: '16px',
                  borderRadius: '12px',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: '#FFFFFF',
                  textAlign: 'center'
                }}
              >
                {mnemonic}
              </div>
              <button
                className="full-width-button"
                onClick={onContinueToWallet}
                style={{ marginTop: '24px' }}
              >
                Continue to Wallet
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ width: '100%' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            Restore Wallet
          </h3>

          <textarea
            placeholder="Enter your 12-word seed phrase"
            value={seedInput}
            onChange={(e) => onSeedInputChange(e.target.value)}
            style={{
              background: '#1E2025',
              border: '1px solid #00FF2B',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '16px',
              width: '100%',
              minHeight: '100px',
              fontSize: '14px',
              fontFamily: 'monospace',
              marginBottom: '16px'
            }}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="full-width-button"
              onClick={onRestoreWallet}
              disabled={!seedInput.trim() || seedInput.trim().split(/\s+/).length !== 12}
            >
              Restore
            </button>

            <button className="full-width-button" onClick={onCancelRestore}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitScreen;
