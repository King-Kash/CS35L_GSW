import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/LocationView.css';
import NavBar from '../components/NavBar';

export default function LocationView() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedSpot = location.state?.location;
    
    // Define a default image URL
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

    // Redirect if no location data is provided
    if (!selectedSpot) {
        navigate('/locations');
        return null;
    }

    const goToReviews = () => {
        navigate('/review', { state: { location: selectedSpot } });
    }

    const goBack = () => {
        navigate('/locations');
    }

    // Process rating data
    const processedSpot = {
        ...selectedSpot,
        rating: parseFloat(selectedSpot.rating?.$numberDecimal ?? selectedSpot.rating),
    };

    let label;
    if (selectedSpot.reviews?.length == 0 || !selectedSpot.reviews) {
      label = "No Reviews Yet"
    }
    if (selectedSpot.reviews?.length > 0 && selectedSpot.reviews?.length < 5) {
      label = "Underground Spot"
    }
    if (selectedSpot.reviews?.length > 5) {
      label = "Popular Spot"
    }

    return (
        <div className="location-view-page">
            <NavBar />
            <div className="location-view-container">
                <div className="location-view">
                    <button className="back-button" onClick={goBack}>
                        ← Back to All Locations
                    </button>
                    <h1>{processedSpot.name}</h1>
                    <div className="location-image">
                        <img 
                            src={processedSpot.image || DEFAULT_IMAGE} 
                            alt={processedSpot.name}
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loops
                                e.target.src = DEFAULT_IMAGE;
                            }}
                        />
                    </div>
                    <p>{processedSpot.description || "No description available."}</p>
                    <div className="rating">
                        {processedSpot.rating === 0 ? (
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
                    <button className="reviews-button" onClick={goToReviews}>
                        Write a Review
                    </button>
                </div>
            </div>
        </div>
    );
}