import { useEffect, useRef, useState } from 'react';
import '../styles/LocationView.css';
import NavBar from '../components/NavBar';

export default function LocationView({ selectedSpot, setShowLocationView }) {

    const locationObject = {
        "location": {
            "type": "Point",
            "coordinates": [
                -118.2437,
                34.0522
            ]
        },
        "_id": "6828d5c6590e03c2a8fb3e68",
        "name": "Updated Location Name",
        "rating": {
            "$numberDecimal": "4.5"
        },
        "reviews": [],
        "image": "https://example.com/new-image.jpg",
        "description": "This is an updated description of the location.",
        "tags": ["library", "quiet", "crowded"],
        "createdAt": "2025-05-17T18:30:30.767Z",
        "updatedAt": "2025-05-17T18:39:34.332Z",
        "__v": 0
    }

    const goToReviews = () => {
      console.log("go to reviews")
    }

    selectedSpot = {
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
      <div className="location-view-container">
        <div className="location-view">
            <button className="close-button" onClick={() => setShowLocationView(false)}>×</button>
            <div className="top-part">
              <div className="location-image"></div>
              <div className="right-box">
                <h1 className="location-title">{selectedSpot.name}</h1>
                <div className="rating">
                  {selectedSpot.rating === 0 ? (
                    <>
                      <span>Rating: </span>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < selectedSpot.rating ? "#FFD700" : "#ccc" }}>
                          &#9733;
                        </span>
                      ))}
                      &nbsp; ({selectedSpot.rating})
                    </>
                  ) : (
                    <>
                      <span>Rating: </span>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < selectedSpot.rating ? "#FFD700" : "#ccc" }}>
                          &#9733;
                        </span>
                      ))}
                      &nbsp; ({selectedSpot.rating})
                    </>
                  )}
                </div>
                <div className="rating-info">
                  <div className="label">{label}</div>
                  
                </div>
              </div>
            </div>
            <p>{selectedSpot.description || "No description available."}</p>
            <p>{selectedSpot.tags || "No tags yet"}</p>
            <button className="reviews-button" onClick={goToReviews}>
              Go to Reviews
            </button>
        </div>
      </div>
    );
}