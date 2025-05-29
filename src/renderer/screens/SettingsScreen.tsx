import React from 'react';
import sparkyImg from '../assets/sparky.png';
import satsImg from '../assets/sats.png';

interface SettingsScreenProps {
  balance: string;
  onViewTransfers: () => void;
  onWalletClick: () => void;
  onDepositClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  balance,
  onViewTransfers,
  onWalletClick,
  onDepositClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  const formatted = balance ? balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

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

        {/* Settings Content (replaces action buttons) */}
        <div className="settings-content">
          <button className="settings-view-transfers-button" onClick={onViewTransfers}>
            VIEW TRANSFERS
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

export default SettingsScreen; 