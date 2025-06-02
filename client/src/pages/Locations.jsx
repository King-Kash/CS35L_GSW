import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Locations.css';
import NavBar from '../components/NavBar';
import PinButton from '../components/PinButton';
import { AuthContext } from '../AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const LocationSelector = () => {
  const [locations, setLocations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const navigate = useNavigate();
  
  // Define a default image for study spots
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  const { user } = useContext(AuthContext);

  const [locationTags, setLocationTags] = useState({});

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    // Fetch top tags for all locations
    const fetchAllTags = async () => {
      const tagsMap = {};
      for (const location of locations) {
        const tags = await fetchTopTags(location._id);
        tagsMap[location._id] = tags;
      }
      setLocationTags(tagsMap);
    };
    
    if (locations.length > 0) {
      fetchAllTags();
    }
  }, [locations]);

  const fetchLocations = async () => {
    try {
      const response = await fetch(API_URL + '/locations/all');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!user) {
      setRecommendationsError('Please log in to see personalized recommendations');
      return;
    }

    setRecommendationsLoading(true);
    setRecommendationsError(null);
    
    try {
      const recommendationsResponse = await fetch(`${API_URL}/search/recommendations`, {
        credentials: 'include' // Use cookies for authentication
      });

      if (recommendationsResponse.ok) {
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData.recommendations || []);
        if (recommendationsData.recommendations?.length === 0) {
          setRecommendationsError('No recommendations available. Try rating some locations first!');
        }
      } else {
        setRecommendationsError('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendationsError('Error loading recommendations');
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Function to fetch top tags for a location
  const fetchTopTags = async (locationId) => {
    try {
      const response = await fetch(`${API_URL}/locations/${locationId}/top-tags`);
      if (response.ok) {
        const data = await response.json();
        return data.topTags || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching top tags:', error);
      return [];
    }
  };

  const handleShowRecommendations = () => {
    if (!showRecommendations && recommendations.length === 0) {
      fetchRecommendations();
    }
    setShowRecommendations(!showRecommendations);
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    navigate(`/location-view/${location._id}`);
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loops
    e.target.src = DEFAULT_IMAGE;
  };
  
  const renderLocationCard = (location, isRecommendation = false) => (
    <div
      key={location._id}
      className={`location-card ${isRecommendation ? 'recommendation-card' : ''}`}
    >
      <div className="card-content" onClick={() => handleLocationSelect(location)}>
        <img 
          src={location.image || DEFAULT_IMAGE} 
          alt={location.name}
          className="location-image"
          onError={handleImageError}
        />
        <div className="location-info">
          <h3>{location.name}</h3>
          {location.description && (
            <p className="location-description">{location.description}</p>
          )}
          <div className="location-rating">
            {parseFloat(location.rating?.$numberDecimal ?? location.rating).toFixed(1)}
          </div>
          {locationTags[location._id] && locationTags[location._id].length > 0 && (
            <div className="location-card-tags">
              {locationTags[location._id].map(tag => (
                <span key={tag} className="location-card-tag">{tag}</span>
              ))}
            </div>
          )}
          {isRecommendation && (
            <div className="recommendation-badge">Recommended for you</div>
          )}
        </div>
      </div>
      <div className="location-card-actions">
        <PinButton locationId={location._id} className="card-pin-button" />
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading locations...</div>;
  }

  return (
    <div className="location-selector">
      <h1 className="location-title">Select a Location to Explore or Review</h1>
      
      {/* Recommendations Section */}
      {user && (
        <div className="recommendations-section">
          <button 
            className={`recommendations-toggle-btn ${showRecommendations ? 'active' : ''}`}
            onClick={handleShowRecommendations}
            disabled={recommendationsLoading}
          >
            {recommendationsLoading ? 'Loading...' : showRecommendations ? 'Hide Recommendations' : 'Show Personalized Recommendations'}
          </button>
          
          {showRecommendations && (
            <div className="recommendations-container">
              <h2>Recommended for You</h2>
              {recommendationsLoading ? (
                <div className="loading">Loading recommendations...</div>
              ) : recommendationsError ? (
                <div className="recommendations-error">{recommendationsError}</div>
              ) : recommendations.length > 0 ? (
                <div className="recommendations-grid">
                  {recommendations.map(location => renderLocationCard(location, true))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="locations-grid">
        {filteredLocations.map((location) => renderLocationCard(location))}
      </div>
      
      {filteredLocations.length === 0 && !loading && (
        <div className="no-locations">
          No locations found. Try a different search term.
        </div>
      )}
    </div>
  );
};

const Locations = () => {
  return (
    <div className="locations-page">
      <NavBar />
      <div className="locations-content">
        <LocationSelector />
      </div>
    </div>
  );
};

export default Locations;
