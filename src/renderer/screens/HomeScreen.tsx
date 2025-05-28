import React from 'react';

interface HomeScreenProps {
  balance: string;
  onSendClick: () => void;
  onReceiveClick: () => void;
  onDepositClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  balance,
  onSendClick,
  onReceiveClick,
  onDepositClick,
  onSettingsClick,
  onLogoutClick
}) => {
  return (
    <div className="wallet-card" style={{ position: 'relative' }}>
      {/* Settings button in top right corner */}
      <button
        onClick={onSettingsClick}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'transparent',
          border: 'none',
          color: '#FFFFFF',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '4px',
          opacity: 0.7,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
      >
        ⋯
      </button>

      <div className="balance-display">
        {balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        <span className="balance-unit">SATS</span>
      </div>

      <div className="button-container">
        <button onClick={onSendClick}>Send</button>
        <button onClick={onReceiveClick}>Receive</button>
      </div>

      <button className="full-width-button" onClick={onDepositClick}>Deposit</button>
      
      <div 
        onClick={onLogoutClick}
        style={{ 
          marginTop: '45px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#00FF2B',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        LOGOUT
      </div>
    </div>
  );
};

export default HomeScreen;