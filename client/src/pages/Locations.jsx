import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Locations.css';
import NavBar from '../components/NavBar';

const API_URL = import.meta.env.VITE_API_URL;

const LocationSelector = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Define a default image for study spots
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

  useEffect(() => {
    fetchLocations();
  }, []);

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

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    navigate('/location-view', { state: { location } });
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loops
    e.target.src = DEFAULT_IMAGE;
  };

  if (loading) {
    return <div className="loading">Loading locations...</div>;
  }

  return (
    <div className="location-selector">
      <h1>Select a Location to View</h1>
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
        {filteredLocations.map((location) => (
          <div
            key={location._id}
            className="location-card"
            onClick={() => handleLocationSelect(location)}
          >
            {/* Always render an image, using the default if none exists */}
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
                ⭐ {parseFloat(location.rating?.$numberDecimal ?? location.rating)}
              </div>
            </div>
          </div>
        ))}
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
      <LocationSelector />
    </div>
  );
};

export default Locations;
