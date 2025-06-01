import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/Results.css';

const API_URL = import.meta.env.VITE_API_URL;

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get search parameters from URL
  const searchTerm = searchParams.get('search') || '';
  const tagsParam = searchParams.get('tag') || '';
  
  // Memoize tags to prevent infinite re-renders
  const tags = useMemo(() => {
    return tagsParam ? tagsParam.split(',').filter(tag => tag.trim() !== '') : [];
  }, [tagsParam]);
  
  // State for results
  const [locations, setLocations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('locations'); // 'locations', 'reviews', 'recommendations'

  useEffect(() => {
    fetchResults();
  }, [searchTerm, tagsParam]); // Use tagsParam instead of tags array

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user token for recommendations
      const token = localStorage.getItem('accessToken');
      
      // Prepare search parameters
      const searchData = {
        searchTerm,
        tags: tags
      };

      // Fetch search results for locations and reviews
      const searchResponse = await fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(searchData)
      });

      if (!searchResponse.ok) {
        throw new Error('Failed to fetch search results');
      }

      const searchResults = await searchResponse.json();
      setLocations(searchResults.locations || []);
      setReviews(searchResults.reviews || []);

      // Fetch recommendations if user is logged in
      if (token) {
        try {
          const recommendationsResponse = await fetch(`${API_URL}/recommendations`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (recommendationsResponse.ok) {
            const recommendationsData = await recommendationsResponse.json();
            setRecommendations(recommendationsData.recommendations || []);
          }
        } catch (recError) {
          console.warn('Failed to fetch recommendations:', recError);
          // Don't throw here, just continue without recommendations
        }
      }

    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = (locationId) => {
    navigate(`/location-view/${locationId}`);
  };

  const renderLocationCard = (location) => (
    <div key={location._id} className="result-card location-card" onClick={() => handleLocationClick(location._id)}>
      {location.image && (
        <img src={location.image} alt={location.name} className="result-image" />
      )}
      <div className="result-content">
        <h3>{location.name}</h3>
        {location.description && <p className="result-description">{location.description}</p>}
        <div className="result-rating">
          ⭐ {parseFloat(location.rating?.$numberDecimal ?? location.rating).toFixed(1)}
        </div>
        <div className="result-reviews-count">
          {location.reviews?.length || 0} reviews
        </div>
      </div>
    </div>
  );

  const renderReviewCard = (review) => {
    return (
      <div key={review._id} className="result-card review-card">
        <div className="result-content">
          <div className="review-header">
            <h4>{review.location?.name || 'Unknown Location'}</h4>
            <div className="review-rating">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
          </div>
          <p className="review-content">{review.contents}</p>
          <div className="review-meta">
            <span className="review-author">by {review.user?.username || 'Anonymous'}</span>
            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          {/* Temporarily always show the button for debugging */}
          <div className="review-actions">
            <button 
              className="view-location-btn"
              onClick={() => {
                if (review.location?._id) {
                  handleLocationClick(review.location._id);
                } else {
                  alert('No location ID available');
                }
              }}
            >
              View Location {review.location?._id ? '✓' : '✗'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Searching...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    switch (activeTab) {
      case 'locations':
        return (
          <div className="results-grid">
            {locations.length > 0 ? (
              locations.map(renderLocationCard)
            ) : (
              <div className="no-results">No locations found for your search.</div>
            )}
          </div>
        );
      
      case 'reviews':
        return (
          <div className="results-grid">
            {reviews.length > 0 ? (
              reviews.map(renderReviewCard)
            ) : (
              <div className="no-results">No reviews found for your search.</div>
            )}
          </div>
        );
      
      case 'recommendations':
        const token = localStorage.getItem('accessToken');
        if (!token) {
          return (
            <div className="no-results">
              Please <button onClick={() => navigate('/login')} className="login-link">log in</button> to see personalized recommendations.
            </div>
          );
        }
        return (
          <div className="results-grid">
            {recommendations.length > 0 ? (
              recommendations.map(renderLocationCard)
            ) : (
              <div className="no-results">No recommendations available. Try rating some locations first!</div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="results-page">
      <NavBar />
      <div className="results-container">
        <div className="results-header">
          <h1>Search Results</h1>
          {searchTerm && (
            <p className="search-info">
              Results for: "<span className="search-term">{searchTerm}</span>"
            </p>
          )}
          {tags.length > 0 && (
            <div className="tags-info">
              Tags: {tags.map(tag => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="results-tabs">
          <button 
            className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            Locations ({locations.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations ({recommendations.length})
          </button>
        </div>

        <div className="results-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Results; 