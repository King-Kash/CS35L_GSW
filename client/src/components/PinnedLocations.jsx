import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import PinButton from './PinButton';
import './PinnedLocations.css';

const PinnedLocations = () => {
    const [pinnedLocations, setPinnedLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { checkAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPinnedLocations();
    }, []);

    const fetchPinnedLocations = async () => {
        try {
            const authResult = await checkAuth();
            if (!authResult) {
                setError('Please log in to view pinned locations');
                setLoading(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/pins/my-pins`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setPinnedLocations(data.pinnedLocations);
            } else {
                throw new Error('Failed to fetch pinned locations');
            }
        } catch (err) {
            console.error('Error fetching pinned locations:', err);
            setError('Failed to load pinned locations');
        } finally {
            setLoading(false);
        }
    };

    const handleLocationClick = (locationId) => {
        navigate(`/location-view/${locationId}`);
    };

    const handlePinToggle = (isPinned, locationId) => {
        if (!isPinned) {
            // Remove from local state when unpinned
            setPinnedLocations(prev => 
                prev.filter(pin => pin.location._id !== locationId)
            );
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="pinned-locations">
                <h3>📍 Pinned Locations</h3>
                <div className="loading">Loading pinned locations...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pinned-locations">
                <h3>📍 Pinned Locations</h3>
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="pinned-locations">
            <h3>📍 Pinned Locations</h3>
            
            {pinnedLocations.length === 0 ? (
                <div className="no-pins">
                    <p>You haven't pinned any locations yet.</p>
                    <p>Explore the map and pin your favorite study spots!</p>
                </div>
            ) : (
                <div className="pins-grid">
                    {pinnedLocations.map((pin) => {
                        const location = pin.location;
                        const rating = parseFloat(location.rating?.$numberDecimal ?? location.rating);
                        
                        return (
                            <div key={pin._id} className="pin-card">
                                <div className="pin-card-content">
                                    <div className="pin-image">
                                        {location.image ? (
                                            <img 
                                                src={location.image} 
                                                alt={location.name}
                                                onClick={() => handleLocationClick(location._id)}
                                            />
                                        ) : (
                                            <div 
                                                className="pin-image-placeholder"
                                                onClick={() => handleLocationClick(location._id)}
                                            >
                                                📍
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="pin-details">
                                        <h4 
                                            className="pin-name"
                                            onClick={() => handleLocationClick(location._id)}
                                        >
                                            {location.name}
                                        </h4>
                                        
                                        <div className="pin-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <span 
                                                    key={i} 
                                                    style={{ 
                                                        color: i < rating ? "#FFD700" : "#ccc",
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                            <span className="rating-number">({rating.toFixed(1)})</span>
                                        </div>
                                        
                                        {location.description && (
                                            <p className="pin-description">
                                                {location.description.length > 100 
                                                    ? `${location.description.substring(0, 100)}...`
                                                    : location.description
                                                }
                                            </p>
                                        )}
                                        
                                        <div className="pin-meta">
                                            <span className="pin-date">
                                                Pinned {formatDate(pin.pinnedAt)}
                                            </span>
                                        </div>
                                        
                                        <div className="pin-actions">
                                            <PinButton 
                                                locationId={location._id}
                                                onPinToggle={(isPinned) => handlePinToggle(isPinned, location._id)}
                                                className="compact"
                                            />
                                            <button 
                                                className="view-location-btn"
                                                onClick={() => handleLocationClick(location._id)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PinnedLocations; 