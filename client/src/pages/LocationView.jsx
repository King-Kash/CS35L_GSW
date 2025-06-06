import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/LocationView.css';
import NavBar from '../components/NavBar';
import PinButton from '../components/PinButton';

const API_URL = import.meta.env.VITE_API_URL;

export default function LocationView() {
    const navigate = useNavigate();
    const location = useLocation();
    const [reviews, setReviews] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [locationFilter, setLocationFilter] = useState('');
    const [topTags, setTopTags] = useState([]);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define a default image URL
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
    const { locationId } = useParams();

    const normalizeReview = (review) => {
      return {
        id: review._id || review.id,
        username: review.user?.name || review.user?.username || review.username,
        locationName: review.location?.name || review.locationName,
        locationId: review.location?._id,
        rating: review.rating,
        content: review.contents || review.content,
        createdAt: review.timestamp || review.createdAt,
        image: review.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: review.tags || []
      };
    };

    useEffect(() => {
        if (selectedSpot && selectedSpot._id) {
            setLocationFilter(selectedSpot._id);
        }
    }, [selectedSpot]);

    useEffect(() => {
      const fetchReviews = async () => {
        try {
          setLoading(true);
          
          // Build query parameters for filtering
          const params = new URLSearchParams();
          if (locationFilter) params.append('location', locationFilter);
          
          const queryString = params.toString() ? `?${params.toString()}` : '';
          const url = `${API_URL}/reviews${queryString}`;
          console.log("Fetching from:", url);
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            mode: 'cors'
          });
          
          if (!response.ok) {
            console.error("Response error:", response.status, response.statusText);
            throw new Error(`Failed to fetch reviews: ${response.status}`);
          }
          
          const data = await response.json();
          setReviews(data);
          
          // Extract unique locations if no filter is applied
          if (data.length > 0) {
            let allTags = [];
              data.forEach(review => {
                const reviewTags = review.tags || [];
                allTags = [...allTags, ...reviewTags];
              });
              const uniqueTags = [...new Set(allTags)];
              setAvailableTags(uniqueTags);
          }
          
        } catch (err) {
          console.error('Error fetching reviews:', err);
          setError(err.message);
          // Fall back to sample data if API fails
          setReviews([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchReviews();
    }, [locationFilter]);

    const fetchTopTags = async (locId) => {
    try {
        const response = await fetch(`${API_URL}/locations/${locId}/top-tags`);
        if (response.ok) {
        const data = await response.json();
        setTopTags(data.topTags || []);
        } else {
        console.error('Failed to fetch top tags');
        }
    } catch (error) {
        console.error('Error fetching top tags:', error);
    }
    };

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setLocationLoading(true);
                setError(null); // Clear any previous errors
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
                fetchTopTags(locationId);
                setLocationLoading(false); // Only set locationLoading to false on success
            } catch (err) {
                setError(err.message);
                console.error('Error fetching location:', err);
                setLocationLoading(false); // Set locationLoading to false on error
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

    if (locationLoading) {
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
                          <img 
                            src={processedSpot.image || DEFAULT_IMAGE} 
                            alt={processedSpot.name}
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loops
                                e.target.src = DEFAULT_IMAGE;
                            }}
                          />
                      </div>
                      
                      <div className="right-part">
                        <p className="location-description-2">{processedSpot.description || "No description available."}</p>
                        
                        <div className="rating">
                            {processedSpot.reviews?.length === 0 ? (
                                <span>Be the first to review this study spot!</span>
                            ) : (
                                <>
                                    <span>Rating: </span>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: i < processedSpot.rating ? "#FFD700" : "#ccc" }}>
                                            &#9733;
                                        </span>
                                    ))}
                                    &nbsp; ({processedSpot.rating.toFixed(1)})
                                </>
                            )}
                        </div>
                        
                        <p className="location-tags-2">
                            {topTags.length > 0 
                                ? (
                                <>
                                    <span className="tags-label">Top Tags: </span>
                                    {topTags.map(tag => (
                                    <span key={tag} className="location-tag">
                                        {tag}
                                    </span>
                                    ))}
                                </>
                                ) 
                                : "No tags yet"}
                            </p>
                        
                        <button className="reviews-button-2" onClick={goToReviews}>
                            Write a Review
                        </button>
                        
                        <div className="pin-button-container">
                            <PinButton locationId={processedSpot._id} className="large" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="reviews-section">
                      {!processedSpot.reviews || processedSpot.reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                      ) : ( 
                        reviews.map(review => {
                          const normalizedReview = normalizeReview(review);
                          return (
                            <div key={normalizedReview.id} className="review-card">
                              <div className="review-info">
                                <h3 className="review-location">{normalizedReview.locationName}</h3>
                                <span className="review-username">by {normalizedReview.username}</span>
                                <span className="review-city-state">{normalizedReview.cityState}</span>
                                
                                {normalizedReview.tags && normalizedReview.tags.length > 0 && (
                                  <div className="review-tags">
                                    {normalizedReview.tags.map(tag => (
                                      <span key={tag} className="review-tag">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
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