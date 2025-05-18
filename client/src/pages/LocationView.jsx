import { useEffect, useRef, useState } from 'react';
import './LocationView.css';

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

    console.log(selectedSpot.image)
    return (
      <div className="location-view-container">
        <div className="location-view">
            <button className="close-button" onClick={() => setShowLocationView(false)}>×</button>
            <h1>{selectedSpot.name}</h1>
            <div className="location-image"></div>
            <p>{selectedSpot.description || "No description available."}</p>
            <div className="rating">
              {selectedSpot.rating === 0 ? (
                <span>Be the first to review this study spot!</span>
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
            <button className="reviews-button" onClick={goToReviews}>
              Go to Reviews
            </button>
        </div>
      </div>
    );
}