import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/LocationView.css';
import NavBar from '../components/NavBar';

const API_URL = import.meta.env.VITE_API_URL;

export default function LocationView() {
    const navigate = useNavigate();
    const { locationId } = useParams();
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const normalizeReview = (review) => {
      return {
        id: review._id || review.id,
        username: review.user?.username || review.username,
        locationName: review.location?.name || review.locationName,
        locationId: review.location?._id,
        rating: review.rating,
        content: review.contents || review.content,
        createdAt: review.timestamp || review.createdAt,
        image: review.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      };
    };

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/locations/all`);
                if (!response.ok) {
                    throw new Error('Failed to fetch locations');
                }
                const locations = await response.json();
                const location = locations.find(loc => loc._id === locationId);
                
                if (!location) {
                    throw new Error('Location not found');
                }
                
                setSelectedSpot(location);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching location:', err);
            } finally {
                setLoading(false);
            }
        };

        if (locationId) {
            fetchLocation();
        } else {
            navigate('/locations');
        }
    }, [locationId, navigate]);

    const goToReviews = () => {
        if (selectedSpot) {
            navigate('/review', { state: { location: selectedSpot } });
        }
    }

    const goBack = () => {
        // Check if there's history to go back to
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/locations');
        }
    }

    if (loading) {
        return (
            <div className="location-view-page">
                <NavBar />
                <div className="location-view-container">
                    <div className="loading">Loading location...</div>
                </div>
            </div>
        );
    }

    if (error || !selectedSpot) {
        return (
            <div className="location-view-page">
                <NavBar />
                <div className="location-view-container">
                    <div className="error">
                        <p>Error: {error || 'Location not found'}</p>
                        <button onClick={goBack}>← Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    // Process rating data
    const processedSpot = {
        ...selectedSpot,
        rating: parseFloat(selectedSpot.rating?.$numberDecimal ?? selectedSpot.rating),
    };

    console.log(processedSpot.reviews)

    return (
        <div className="location-view-page">
            <NavBar />
            <div className="location-view-container">
                <div className="location-view-2">
                    <button className="back-button" onClick={goBack}>
                        ← Back
                    </button>
                    <h1 className="location-view-title">{processedSpot.name}</h1>
                    <div className="location-top-part-2">
                      <div className="location-image-2">
                          {processedSpot.image && (
                              <img src={processedSpot.image} alt={processedSpot.name} />
                          )}
                      </div>
                      <div className="right-part">
                        <p className="location-description-2">{processedSpot.description || "No description available."}</p>
                        <div className="rating">
                            {processedSpot.reviews.length === 0 ? (
                                <span>Be the first to review this study spot!</span>
                            ) : (
                                <>
                                    <span>Rating: </span>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: i < processedSpot.rating ? "#FFD700" : "#ccc" }}>
                                            &#9733;
                                        </span>
                                    ))}
                                    &nbsp; ({processedSpot.rating})
                                </>
                            )}
                        </div>
                        <button className="reviews-button-2" onClick={goToReviews}>
                            Write a Review
                        </button>
                      </div>
                    </div>
                    <div className="reviews-section">
                      {processedSpot.reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                      ) : ( processedSpot.reviews.map(review => {
                          const normalizedReview = normalizeReview(review);
                          return (
                            <div key={normalizedReview.id} className="review-card">
                              <div className="review-info">
                                <h3 className="review-location">{normalizedReview.locationName}</h3>
                                <span className="review-username">by {normalizedReview.username}</span>
                                <span className="review-city-state">{normalizedReview.cityState}</span>
                                <div className="review-rating">
                                  {Array(5).fill().map((_, i) => (
                                    <span key={i} className={i < normalizedReview.rating ? "star filled" : "star"}>★</span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="review-main-content">
                                <div className="review-content">
                                  <p>{normalizedReview.content}</p>
                                  <span className="review-date">{new Date(normalizedReview.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                </div>
            </div>
        </div>
    );
}