import React from 'react';

interface SettingsScreenProps {
  onViewTransfers: () => void;
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onViewTransfers,
  onBack
}) => {
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
        Settings
      </h1>

      <div style={{ marginBottom: '24px' }}>
        <button 
          className="full-width-button" 
          onClick={onViewTransfers}
          style={{ marginBottom: '16px' }}
        >
          View Transfers
        </button>
      </div>

      <button className="full-width-button" onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
};

export default SettingsScreen; 