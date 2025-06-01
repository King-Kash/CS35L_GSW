import { useNavigate } from 'react-router-dom';
import '../styles/LocationViewModal.css';
import PinButton from './PinButton';

export default function LocationViewModal({ selectedSpot, setShowLocationView }) {
    const navigate = useNavigate();

    if (!selectedSpot) {
        return null;
    }

    const goToReviews = () => {
        navigate('/review', { state: { location: selectedSpot } });
    }

    const goToLocationPage = () => {
        console.log(selectedSpot._id)
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
                                <img src={processedSpot.image} alt={processedSpot.name} />
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
                            <div className="pin-button-container">
                                <PinButton locationId={processedSpot._id} className="large" />
                            </div>
                        </div>
                    </div>
                    <div className="bottom-part">
                        <p>{processedSpot.description || "No description available."}</p>
                        <p>{processedSpot.tags?.length > 0 || "No tags yet"}</p>
                        <div className="button-group">
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
        </div>
    );
} 