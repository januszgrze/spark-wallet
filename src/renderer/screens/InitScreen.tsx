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
  // PIN-related props
  showPinSetup?: boolean;
  showPinEntry?: boolean;
  pinInput?: string;
  onPinInputChange?: (pin: string) => void;
  onSetPin?: (pin: string) => void;
  onVerifyPin?: (pin: string) => void;
  onCancelPin?: () => void;
  pinError?: string;
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
  onClearSavedWallet,
  // PIN-related props
  showPinSetup,
  showPinEntry,
  pinInput,
  onPinInputChange,
  onSetPin,
  onVerifyPin,
  onCancelPin,
  pinError
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

  const renderPinInput = (title: string, subtitle: string, onSubmit: (pin: string) => void) => {
    const handlePinChange = (value: string) => {
      // Only allow digits and max 4 characters
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      if (onPinInputChange) {
        onPinInputChange(cleaned);
      }
    };

    const handleSubmit = () => {
      if (pinInput && pinInput.length === 4) {
        onSubmit(pinInput);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && pinInput && pinInput.length === 4) {
        handleSubmit();
      }
    };

    return (
      <div style={{ width: '100%' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '14px', color: '#999', marginBottom: '24px' }}>
          {subtitle}
        </p>

        {/* PIN Input Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              style={{
                width: '50px',
                height: '50px',
                border: '2px solid #00FF2B',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                background: pinInput && pinInput[index] ? '#00FF2B20' : 'transparent'
              }}
            >
              {pinInput && pinInput[index] ? '●' : ''}
            </div>
          ))}
        </div>

        {/* Hidden input for mobile keyboards */}
        <input
          type="tel"
          value={pinInput || ''}
          onChange={(e) => handlePinChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter 4-digit PIN"
          maxLength={4}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            textAlign: 'center',
            background: '#1E2025',
            border: '1px solid #00FF2B',
            borderRadius: '12px',
            color: '#FFFFFF',
            marginBottom: '16px',
            letterSpacing: '8px'
          }}
        />

        {pinError && (
          <div style={{
            color: '#FF3B3B',
            fontSize: '14px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {pinError}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="full-width-button"
            onClick={handleSubmit}
            disabled={!pinInput || pinInput.length !== 4}
          >
            Continue
          </button>
          {onCancelPin && (
            <button className="full-width-button" onClick={onCancelPin}>
              Cancel
            </button>
          )}
        </div>
      </div>
    );
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

      {/* PIN Setup Screen - only show when explicitly setting up PIN */}
      {showPinSetup && onSetPin ? (
        renderPinInput(
          "Set Your PIN",
          "Create a 4-digit PIN to secure your wallet",
          onSetPin
        )
      ) : 
      
      /* PIN Entry Screen - only show when verifying PIN for saved wallet */
      showPinEntry && onVerifyPin ? (
        renderPinInput(
          "Enter Your PIN",
          "Enter your 4-digit PIN to access your wallet",
          onVerifyPin
        )
      ) :

      /* Restore Wallet Screen */
      isRestoring ? (
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
      ) : 

      /* Main Init Screen */
      (
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
                Log back in
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
                <strong>⚠️ IMPORTANT:</strong> Please save your seed phrase in a secure location. Copy it to a password manager or write it down. You will need it to restore your wallet.
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
      )}
    </div>
  );
};

export default InitScreen;
 