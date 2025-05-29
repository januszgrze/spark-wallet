import React from 'react';
import sparkyImg from '../assets/sparky.png';
import satsImg from '../assets/sats.png';

interface HomeScreenProps {
  balance: string;
  onSendClick: () => void;
  onReceiveClick: () => void;
  onWalletClick: () => void;
  onDepositClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  balance,
  onSendClick,
  onReceiveClick,
  onWalletClick,
  onDepositClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  const formatted = balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="home-screen-container">
      <div className="home-screen-background">
        {/* Sparky Logo */}
        <div className="sparky-logo">
          <img src={sparkyImg} alt="Sparky" className="sparky-image" />
        </div>

        {/* Balance Amount */}
        <div className="balance-container">
          <div className="balance-amount">{formatted}</div>
          <div className="sats-logo">
            <img src={satsImg} alt="Sats" className="sats-image" />
          </div>
        </div>

        {/* Send and Receive Buttons */}
        <div className="action-buttons-container">
          <button className="send-button" onClick={onSendClick}>
            <div className="button-text">SEND</div>
            <div className="send-arrow">↗</div>
          </button>
          <button className="receive-button" onClick={onReceiveClick}>
            <div className="button-text">RECEIVE</div>
            <div className="receive-arrow">↙</div>
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button className="nav-button wallet-button" onClick={onWalletClick}>
            WALLET
          </button>
          <button className="nav-button deposit-button" onClick={onDepositClick}>
            DEPOSIT
          </button>
          <button className="nav-button settings-button" onClick={onSettingsClick}>
            SETTINGS
          </button>
          <button className="nav-button logout-button" onClick={onLogoutClick}>
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;