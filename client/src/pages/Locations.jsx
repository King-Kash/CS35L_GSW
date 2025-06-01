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
    navigate(`/location-view/${location._id}`);
  };

  if (loading) {
    return <div className="loading">Loading locations...</div>;
  }

  return (
    <div className="location-selector">
      <h1 className="location-title">Select a Location to Explore or Review</h1>
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
            {location.image && (
              <img 
                src={location.image} 
                alt={location.name}
                className="location-image"
              />
            )}
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