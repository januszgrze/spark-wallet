import React from 'react';

interface HomeScreenProps {
  balance: string;
  onSendClick: () => void;
  onReceiveClick: () => void;
  onDepositClick: () => void;
  onLogoutClick: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  balance,
  onSendClick,
  onReceiveClick,
  onDepositClick,
  onLogoutClick
}) => {
  return (
    <div className="wallet-card">
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