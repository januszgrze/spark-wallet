import React, { useState, useEffect } from 'react';

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
  onCopyMnemonic?: (text: string) => void;
  copySuccess?: string;
  hasSavedWallet?: boolean;
  onRestoreSavedWallet?: () => void;
  onClearSavedWallet?: () => void;
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
  onContinueToWallet,
  onCopyMnemonic,
  copySuccess,
  hasSavedWallet,
  onRestoreSavedWallet,
  onClearSavedWallet
}) => {
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  // Show notification when mnemonic is copied
  useEffect(() => {
    if (copySuccess === mnemonic && mnemonic) {
      setShowCopyNotification(true);
      const timer = setTimeout(() => {
        setShowCopyNotification(false);
      }, 3000); // Hide after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [copySuccess, mnemonic]);

  const dismissNotification = () => {
    setShowCopyNotification(false);
  };

  return (
    <div className="wallet-card" style={{ justifyContent: 'flex-start', position: 'relative' }}>
      {/* Copy Success Notification */}
      {showCopyNotification && (
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              animation: 'fadeIn 0.3s ease-out',
              cursor: 'pointer'
            }}
            onClick={dismissNotification}
          />
          
          {/* Popup Modal */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1E2025',
            border: '2px solid #00FF2B',
            borderRadius: '16px',
            padding: '32px',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            animation: 'popupScale 0.3s ease-out',
            textAlign: 'center',
            minWidth: '300px',
            cursor: 'pointer'
          }}
          onClick={dismissNotification}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              ✅
            </div>
            <div style={{
              color: '#00FF2B',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              Success!
            </div>
            <div style={{
              color: '#FFFFFF',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Your seed phrase has been copied to clipboard
            </div>
            <div style={{
              color: '#666',
              fontSize: '12px'
            }}>
              Make sure to store it in a secure location
            </div>
          </div>
        </>
      )}

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
        Wallet Setup
      </h2>

      {!isRestoring ? (
        <>
          {hasSavedWallet && onRestoreSavedWallet && (
            <>
              <button 
                className="full-width-button" 
                onClick={onRestoreSavedWallet}
                style={{ 
                  background: '#00FF2B', 
                  color: '#000000',
                  marginBottom: '16px'
                }}
              >
                Continue with Saved Wallet
              </button>
              
              <div style={{ 
                width: '100%', 
                height: '1px', 
                background: '#333', 
                margin: '16px 0',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#1E2025',
                  padding: '0 12px',
                  color: '#666',
                  fontSize: '12px'
                }}>
                  OR
                </span>
              </div>
            </>
          )}
          
          <button className="full-width-button" onClick={onInitializeWallet}>
            Create New Wallet
          </button>

          <button className="full-width-button" onClick={onStartRestore} style={{ marginTop: '16px' }}>
            Restore Existing Wallet
          </button>

          {hasSavedWallet && onClearSavedWallet && (
            <button 
              onClick={onClearSavedWallet}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                fontSize: '12px',
                marginTop: '24px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear Saved Wallet Data
            </button>
          )}

          {mnemonic && (
            <div style={{ marginTop: '32px', width: '100%' }}>
              <p style={{ marginBottom: '12px' }}>
                <strong>⚠️ IMPORTANT:</strong> Please save your seed phrase in a secure location. You will need it to restore your wallet.
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
                  textAlign: 'center',
                  border: '1px solid #00FF2B',
                  position: 'relative'
                }}
              >
                {mnemonic}
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                {onCopyMnemonic && (
                  <button
                    className="full-width-button"
                    onClick={() => onCopyMnemonic(mnemonic)}
                    style={{ 
                      background: copySuccess === mnemonic ? '#28a745' : '#00FF2B',
                      color: '#000000'
                    }}
                  >
                    {copySuccess === mnemonic ? '✓ Copied!' : '📋 Copy Seed Phrase'}
                  </button>
                )}
                
                <button
                  className="full-width-button"
                  onClick={onContinueToWallet}
                >
                  Continue to Wallet
                </button>
              </div>
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
 