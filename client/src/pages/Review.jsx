import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Locations.css';
import NavBar from '../components/NavBar';

const API_URL = import.meta.env.VITE_API_URL;

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state?.location;

  const [rating, setRating] = useState(5);
  const [contents, setContents] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if no location data is provided
  if (!locationData) {
    navigate('/locations');
    return null;
  }

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
      const response = await fetch(API_URL + '/reviews/addReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          contents,
          location: locationData._id
        })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        navigate('/locations');
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

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="locations-page">
      <NavBar />
      <div className="review-form">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        
        <div className="selected-location">
          <h2>Writing Review for</h2>
          <div className="location-header">
            {locationData.image && (
              <img 
                src={locationData.image} 
                alt={locationData.name}
                className="location-image-small"
              />
            )}
            <div>
              <h3>{locationData.name}</h3>
              {locationData.description && (
                <p className="location-description">{locationData.description}</p>
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
    </div>
  );
};

export default Review; 