import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

console.log('Script loaded');

try {
  const container = document.getElementById('root');
  console.log('Container found:', container);
  
  if (!container) {
    throw new Error('Failed to find the root element');
  }
  
  const root = createRoot(container);
  console.log('Root created');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Render called');
} catch (error: unknown) {
  console.error('Error initializing app:', error);
  // Display error on page
  document.body.innerHTML = `
    <div style="color: red; padding: 20px;">
      Error loading application: ${error instanceof Error ? error.message : 'Unknown error'}
    </div>
  `;
} 