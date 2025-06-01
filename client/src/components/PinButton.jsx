import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './PinButton.css';

const PinButton = ({ locationId, onPinToggle, className = '' }) => {
    const [isPinned, setIsPinned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { checkAuth } = useContext(AuthContext);

    useEffect(() => {
        checkPinStatus();
    }, [locationId]);

    const checkPinStatus = async () => {
        try {
            const authResult = await checkAuth();
            if (!authResult) return;

            const response = await fetch(`${import.meta.env.VITE_API_URL}/pins/check/${locationId}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setIsPinned(data.isPinned);
            }
        } catch (error) {
            console.error('Error checking pin status:', error);
        }
    };

    const handlePinToggle = async () => {
        try {
            const authResult = await checkAuth();
            if (!authResult) {
                alert('Please log in to pin locations');
                return;
            }

            setIsLoading(true);

            const url = isPinned 
                ? `${import.meta.env.VITE_API_URL}/pins/unpin/${locationId}`
                : `${import.meta.env.VITE_API_URL}/pins/pin/${locationId}`;

            const method = isPinned ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method,
                credentials: 'include'
            });

            if (response.ok) {
                const newPinStatus = !isPinned;
                setIsPinned(newPinStatus);
                
                // Call the callback if provided
                if (onPinToggle) {
                    onPinToggle(newPinStatus);
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to update pin status');
            }
        } catch (error) {
            console.error('Error toggling pin:', error);
            alert('Failed to update pin status');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className={`pin-button ${isPinned ? 'pinned' : 'unpinned'} ${className}`}
            onClick={handlePinToggle}
            disabled={isLoading}
            title={isPinned ? 'Unpin location' : 'Pin location'}
        >
            {isLoading ? (
                <span className="pin-loading">⏳</span>
            ) : (
                <span className="pin-icon">
                    {isPinned ? '📍' : '📌'}
                </span>
            )}
            <span className="pin-text">
                {isPinned ? 'Pinned' : 'Pin'}
            </span>
        </button>
    );
};

export default PinButton; 