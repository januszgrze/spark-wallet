import React, { useState, useEffect } from 'react';

interface Transfer {
  id: string;
  senderIdentityPublicKey: Uint8Array;
  receiverIdentityPublicKey: Uint8Array;
  status: string;
  totalValue: number;
  expiryTime: Date | undefined;
  leaves: any[];
  createdTime: Date | undefined;
  updatedTime: Date | undefined;
  type: string;
}

interface TransfersScreenProps {
  wallet: any;
  onBack: () => void;
}

const TransfersScreen: React.FC<TransfersScreenProps> = ({
  wallet,
  onBack
}) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const TRANSFERS_PER_PAGE = 10;

  const loadTransfers = async (page: number = 0, append: boolean = false) => {
    if (!wallet) return;
    
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const offset = page * TRANSFERS_PER_PAGE;
      
      console.log('Loading transfers with limit:', TRANSFERS_PER_PAGE, 'offset:', offset);
      const result = await wallet.getTransfers(TRANSFERS_PER_PAGE, offset);
      console.log('Transfers API response:', result);
      
      // Ensure result is an array
      let transfersArray: Transfer[] = [];
      if (Array.isArray(result)) {
        transfersArray = result;
      } else if (result && Array.isArray(result.transfers)) {
        // In case the API returns an object with a transfers property
        transfersArray = result.transfers;
      } else if (result && typeof result === 'object') {
        // Log the structure to understand the response format
        console.log('Unexpected response structure:', Object.keys(result));
        setError('Unexpected response format from transfers API');
        return;
      } else {
        console.log('No transfers found or invalid response');
        transfersArray = [];
      }
      
      if (append) {
        setTransfers(prev => [...prev, ...transfersArray]);
      } else {
        setTransfers(transfersArray);
      }
      
      // Check if there are more transfers to load
      setHasMore(transfersArray.length === TRANSFERS_PER_PAGE);
      setCurrentPage(page);
    } catch (err: unknown) {
      console.error('Error loading transfers:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load transfers');
      }
      // Ensure transfers is always an array even on error
      if (!append) {
        setTransfers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers(0);
  }, [wallet]);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadTransfers(currentPage + 1, true);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  const formatTransferType = (transfer: Transfer) => {
    // Determine if this is incoming or outgoing based on the transfer data
    // This is a simplified approach - you might need to adjust based on your wallet's public key
    return transfer.type || 'Transfer';
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
        Transfer History
      </h1>

      {error && (
        <div style={{
          background: '#ff4444',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {loading && transfers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#FFFFFF',
          opacity: 0.7,
          padding: '32px'
        }}>
          Loading transfers...
        </div>
      ) : !Array.isArray(transfers) || transfers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#FFFFFF',
          opacity: 0.7,
          padding: '32px'
        }}>
          No transfers found
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '24px' }}>
            {transfers.map((transfer, index) => (
              <div
                key={transfer.id || index}
                style={{
                  background: '#0B0D11',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  border: '1px solid #333'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}>
                    {transfer.totalValue} sats
                  </span>
                  <span style={{
                    color: transfer.status === 'COMPLETED' ? '#4CAF50' : '#FFA726',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {formatStatus(transfer.status)}
                  </span>
                </div>
                
                <div style={{
                  color: '#FFFFFF',
                  opacity: 0.7,
                  fontSize: '14px',
                  marginBottom: '4px'
                }}>
                  Type: {formatTransferType(transfer)}
                </div>
                
                <div style={{
                  color: '#FFFFFF',
                  opacity: 0.5,
                  fontSize: '12px'
                }}>
                  {formatDate(transfer.createdTime)}
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              className="full-width-button"
              onClick={loadMore}
              disabled={loading}
              style={{ marginBottom: '16px' }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </>
      )}

      <button className="full-width-button" onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
};

export default TransfersScreen; 