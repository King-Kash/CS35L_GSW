import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/LocationView.css';
import NavBar from '../components/NavBar';

const API_URL = import.meta.env.VITE_API_URL;

export default function LocationView() {
    const navigate = useNavigate();
    const { locationId } = useParams();
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setLoading(true);
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
            } catch (err) {
                setError(err.message);
                console.error('Error fetching location:', err);
            } finally {
                setLoading(false);
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

    if (loading) {
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
                        ← Back
                    </button>
                    <h1>{processedSpot.name}</h1>
                    <div className="location-image">
                        {processedSpot.image && (
                            <img src={processedSpot.image} alt={processedSpot.name} />
                        )}
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