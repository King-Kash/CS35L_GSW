import { useNavigate } from 'react-router-dom';
import '../styles/LocationViewModal.css';

export default function LocationViewModal({ selectedSpot, setShowLocationView }) {
    
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
    
    const navigate = useNavigate();

    if (!selectedSpot) {
        return null;
    }

    const goToReviews = () => {
        navigate('/review', { state: { location: selectedSpot } });
    }

    const goToLocationPage = () => {
        navigate(`/location-view/${selectedSpot._id}`);
    }

    const closeModal = () => {
        setShowLocationView(false);
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
        <div className="location-view-modal-overlay">
            <div className="location-view-container">
                <div className="location-view">
                    <button className="close-button" onClick={closeModal}>×</button>
                    <div className="top-part">
                        <div className="location-image">
                            {processedSpot.image && (
                                <img 
                                    src={processedSpot.image || DEFAULT_IMAGE} 
                                    alt={processedSpot.name}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loops
                                        e.target.src = DEFAULT_IMAGE;
                                    }}
                                />
                            )}
                        </div>
                        <div className="right-box">
                            <h1 className="location-title">{processedSpot.name}</h1>
                            <div className="rating">
                                <span>Rating: </span>
                                {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: i < processedSpot.rating ? "#FFD700" : "#ccc" }}>
                                    &#9733;
                                </span>
                                ))}
                                &nbsp; ({processedSpot.rating})
                            </div>
                            <div className="rating-info">
                                <div className="label">{label}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-part">
                        <p>{processedSpot.description || "No description available."}</p>
                        <p>{processedSpot.tags || "No tags yet"}</p>
                        <button className="reviews-button" onClick={goToReviews}>
                            Go to Reviews
                        </button>
                        <button className="location-view-link" onClick={goToLocationPage}>
                            Go to Location Page
                        </button>
                        <button className="reviews-button" onClick={goToReviews}>
                            Write a Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
