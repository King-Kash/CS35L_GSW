import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/LocationViewModal.css';
import PinButton from './PinButton';

export default function LocationViewModal({ selectedSpot, setShowLocationView }) {
    
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
    const [topTags, setTopTags] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopTags = async () => {
            if (!selectedSpot?._id) return;
            
            try {
                const response = await fetch(`${API_URL}/locations/${selectedSpot._id}/top-tags`);
                if (response.ok) {
                    const data = await response.json();
                    setTopTags(data.topTags || []);
                }
            } catch (error) {
                console.error('Error fetching top tags:', error);
            }
        };
        
        fetchTopTags();
    }, [selectedSpot, API_URL]);

    if (!selectedSpot) {
        return null;
    }

    const goToReviews = () => {
        navigate('/review', { state: { location: selectedSpot } });
    }

    const goToLocationPage = () => {
        console.log(selectedSpot._id)
        navigate(`/location-view/${selectedSpot._id}`);
    }

    const closeModal = () => {
        setShowLocationView(false);
    }

    // Process rating data
    const processedSpot = {
        ...selectedSpot,
        rating: parseFloat(selectedSpot.rating?.$numberDecimal ?? selectedSpot.rating),
    };

    let label;
    if (selectedSpot.reviews?.length == 0 || !selectedSpot.reviews) {
      label = "No Reviews Yet"
    }
    if (selectedSpot.reviews?.length > 0 && selectedSpot.reviews?.length < 5) {
      label = "Underground Spot"
    }
    if (selectedSpot.reviews?.length > 5) {
      label = "Popular Spot"
    }

    return (
        <div className="location-view-modal-overlay">
            <div className="location-view-container">
                <div className="location-view">
                    <button className="close-button" onClick={closeModal}>×</button>
                    <div className="top-part">
                        <div className="location-image">
                            {processedSpot.image && (
                                <img 
                                    src={processedSpot.image || DEFAULT_IMAGE} 
                                    alt={processedSpot.name}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loops
                                        e.target.src = DEFAULT_IMAGE;
                                    }}
                                />
                            )}
                        </div>
                        <div className="right-box">
                            <h1 className="location-title">{processedSpot.name}</h1>
                            <div className="rating">
                                <span>Rating: </span>
                                {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: i < processedSpot.rating ? "#FFD700" : "#ccc" }}>
                                    &#9733;
                                </span>
                                ))}
                                &nbsp; ({processedSpot.rating})
                            </div>
                            <div className="rating-info">
                                <div className="label">{label}</div>
                            </div>
                            <div className="pin-button-container">
                                <PinButton locationId={processedSpot._id} className="large" />
                            </div>
                        </div>
                    </div>
                    <div className="bottom-part">
                        <p>{processedSpot.description || "No description available."}</p>
                        
                        <div className="location-tags">
                            {topTags.length > 0 ? (
                                <>
                                    <div className="tags-label">Top Tags:</div>
                                    <div className="tags-list">
                                        {topTags.map(tag => (
                                            <span key={tag} className="location-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : null}
                        </div>
                        
                        <div className="button-group">
                          <button className="location-view-link" onClick={goToLocationPage}>
                              Go to Location Page
                          </button>
                          <button className="reviews-button" onClick={goToReviews}>
                              Write a Review
                          </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
