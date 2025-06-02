import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Locations.css';
import NavBar from '../components/NavBar';
import { AuthContext } from '../AuthContext';
import AlertMessage from '../components/AlertMessage';

const API_URL = import.meta.env.VITE_API_URL;

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state?.location;

  const [rating, setRating] = useState(1);
  const [contents, setContents] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const { checkAuth } = useContext(AuthContext);

  // Fetch available tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/reviews/tags`);
        if (response.ok) {
          const tags = await response.json();
          setAvailableTags(tags);
        } else {
          console.error('Failed to fetch tags');
          // Fallback to empty array if fetch fails
          setAvailableTags([]);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
        setAvailableTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

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

    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      alert('Please log in to submit a review.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(API_URL + '/reviews/addReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          contents,
          location: locationData._id,
          user: isAuthenticated.id,
          tags: selectedTags
        })
      });

      if (response.ok) {
        setAlert({ message: 'Your review has been posted! We appreciate your feedback', type: 'success' });
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

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      // Remove tag if already selected
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag if not already selected (max 5 tags)
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        alert('You can select up to 5 tags');
      }
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
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => {
            setAlert(null);
            navigate('/locations');
          }} 
        />
      )}
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

          <div className="tags-section">
            <label>Tags (select up to 5):</label>
            <div className="tags-container">
              {loading ? (
                <p>Loading tags...</p>
              ) : (
                availableTags.map(tag => (
                  <span
                    key={tag}
                    className={`review-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>
            {selectedTags.length > 0 && (
              <div className="selected-tags">
                <p>Selected tags: {selectedTags.join(', ')}</p>
              </div>
            )}
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