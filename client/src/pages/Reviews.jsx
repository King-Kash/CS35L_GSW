import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Reviews.css'; 
import NavBar from '../components/NavBar';

const API_URL = import.meta.env.VITE_API_URL;

export default function Reviews() {
  const navigate = useNavigate();
  // State for reviews and loading/error states
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [ratingFilter, setRatingFilter] = useState(0);
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [locations, setLocations] = useState([]);
  const [tagFilter, setTagFilter] = useState('');
  const [availableTags, setAvailableTags] = useState([]);

  // Handle navigation to add review page
  const handleAddReview = () => {
    navigate('/locations');
  };

  const handleViewLocation = (locationId) => {
    if (locationId) {
      navigate(`/location-view/${locationId}`);
    } else {
      alert('Location ID not available');
    }
  };

  // Fetch reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Build query parameters for filtering
        const params = new URLSearchParams();
        if (ratingFilter > 0) params.append('minRating', ratingFilter);
        if (locationFilter) params.append('location', locationFilter);
        if (dateFilter) params.append('dateFilter', dateFilter);
        if (tagFilter) params.append('tag', tagFilter);
        
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
          if (!locationFilter) {
            const uniqueLocations = [...new Set(data.map(review => 
              review.location?.name || review.locationName
            ))];
            setLocations(uniqueLocations);
          }
          
          if (!tagFilter) {
            // Collect all tags from all reviews
            let allTags = [];
            data.forEach(review => {
              const reviewTags = review.tags || [];
              allTags = [...allTags, ...reviewTags];
            });
            const uniqueTags = [...new Set(allTags)];
            setAvailableTags(uniqueTags);
          }
        }
        
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
        // Fall back to sample data if API fails
        setReviews(sampleReviews);
        const uniqueLocations = [...new Set(sampleReviews.map(review => review.locationName))];
        setLocations(uniqueLocations);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [ratingFilter, locationFilter, dateFilter, tagFilter]);

  const clearFilters = () => {
    setRatingFilter(0);
    setLocationFilter('');
    setDateFilter('');
    setTagFilter('');
  };

  // Sample reviews data as fallback
  const sampleReviews = [
    {
      id: 1,
      username: "JaneSmith",
      locationName: "Koreatown Cafe",
      rating: 4,
      content: "Great atmosphere and friendly staff. The coffee was excellent, and they have good WiFi. Perfect spot for studying.",
      createdAt: "2025-04-15T14:30:00Z",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["Coffee", "Study Spot", "WiFi"]
    },
  ];

  // Normalize review object based on whether it's from the backend or sample data
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

  return (
    <div className="reviews-page">
      <NavBar />
      <div className="reviews-container">
        <div className="filter-column">
          <div className="add-review-container">
            <button 
              className="add-review-button"
              onClick={handleAddReview}
            >
              <span className="add-icon">+</span> Add Review
            </button>
          </div>
          <div className="filter-card">
            <h2>Filters</h2>
            
            <div className="filter-section">
              <h3>Minimum Rating</h3>
              <div className="rating-filter">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span 
                    key={rating}
                    className={`filter-star ${rating <= ratingFilter ? "selected" : ""}`}
                    onClick={() => setRatingFilter(rating === ratingFilter ? 0 : rating)}
                  >
                    ★
                  </span>
                ))}
                {ratingFilter > 0 && <span className="rating-text">({ratingFilter}+ stars)</span>}
              </div>
            </div>

            <div className="filter-section">
              <h3>Location</h3>
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h3>Time Period</h3>
              <div className="date-filter-options">
                <label>
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === 'week'}
                    onChange={() => setDateFilter('week')}
                  />
                  Last Week
                </label>
                <label>
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === 'month'}
                    onChange={() => setDateFilter('month')}
                  />
                  Last Month
                </label>
                <label>
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === '3months'}
                    onChange={() => setDateFilter('3months')}
                  />
                  Last 3 Months
                </label>
                <label>
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === ''}
                    onChange={() => setDateFilter('')}
                  />
                  All Time
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h3>Tags</h3>
              <select 
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Tags</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <button className="clear-filters-button" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>

        <div className="reviews-content">
          <h1 className="reviews-heading">Recent Reviews</h1>
          
          {loading ? (
            <div className="loading-container">
              <p>Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>Error loading reviews: {error}</p>
              <p>Showing sample data instead.</p>
            </div>
          ) : reviews.length === 0 ? (
            <p className="no-reviews">No reviews match your filters.</p>
          ) : (
          <div className="reviews-list">
            {reviews.map(review => {
              const normalizedReview = normalizeReview(review);
              return (
                <div key={normalizedReview.id} className="review-card">
                  <div className="review-info">
                    <h3 className="review-location">{normalizedReview.locationName}</h3>
                    <span className="review-username">by {normalizedReview.username}</span>
                    <span className="review-city-state">{normalizedReview.cityState}</span>
                    
                    {/* Tags moved here - between username and rating */}
                    {normalizedReview.tags && normalizedReview.tags.length > 0 && (
                      <div className="review-tags">
                        {normalizedReview.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="review-tag"
                            onClick={() => setTagFilter(tag === tagFilter ? '' : tag)}
                          >
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
                    <button 
                        className="view-location-button"
                        onClick={() => handleViewLocation(normalizedReview.locationId)}
                      >
                        View Location
                      </button>
                  </div>
                  
                  <div className="review-main-content">
                    <div className="review-content">
                      <p>{normalizedReview.content}</p>
                      <span className="review-date">
                        {new Date(normalizedReview.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="review-image-container">
                    <img 
                      src={normalizedReview.image} 
                      alt={normalizedReview.locationName}
                      className="review-image" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}