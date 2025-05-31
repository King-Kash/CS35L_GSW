import React, { useState, useEffect } from 'react';
import './AddReview.css';
import NavBar from '../components/NavBar';

const LocationSelector = ({ onLocationSelect }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:3000/locations/all');
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

  if (loading) {
    return <div className="loading">Loading locations...</div>;
  }

  return (
    <div className="location-selector">
      <h1>Select a Location to Review</h1>
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
            onClick={() => onLocationSelect(location)}
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
                ⭐ {parseFloat(location.rating).toFixed(1)}
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

const ReviewForm = ({ location, onBack, onSubmitSuccess }) => {
  const [rating, setRating] = useState(5);
  const [contents, setContents] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contents.trim()) {
      alert('Please write a review before submitting.');
      return;
    }

    // Get user token from localStorage (assuming authentication is implemented)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in to submit a review.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/reviews/addReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          contents,
          location: location._id
        })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        onSubmitSuccess();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to submit review'}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
        onClick={() => setRating(index + 1)}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className="review-form">
      <button className="back-button" onClick={onBack}>
        ← Back to Location Selection
      </button>
      
      <div className="selected-location">
        <h2>Writing Review for</h2>
        <div className="location-header">
          {location.image && (
            <img 
              src={location.image} 
              alt={location.name}
              className="location-image-small"
            />
          )}
          <div>
            <h3>{location.name}</h3>
            {location.description && (
              <p className="location-description">{location.description}</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="review-form-container">
        <div className="rating-section">
          <label>Rating:</label>
          <div className="stars-container">
            {renderStars()}
            <span className="rating-text">({rating}/5)</span>
          </div>
        </div>

        <div className="content-section">
          <label htmlFor="review-content">Your Review:</label>
          <textarea
            id="review-content"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            placeholder="Share your experience at this location..."
            rows={6}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

const AddReview = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleBack = () => {
    setSelectedLocation(null);
  };

  const handleSubmitSuccess = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="add-review-page">
      <NavBar />
      {selectedLocation ? (
        <ReviewForm 
          location={selectedLocation}
          onBack={handleBack}
          onSubmitSuccess={handleSubmitSuccess}
        />
      ) : (
        <LocationSelector onLocationSelect={handleLocationSelect} />
      )}
    </div>
  );
};

export default AddReview; 