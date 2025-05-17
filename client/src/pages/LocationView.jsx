import { useEffect, useRef, useState } from 'react';
import './LocationView.css';

export default function LocationView({ setShowLocationView }) {

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

    console.log("locationObject:", locationObject);

    return (
        <div className="location-view">
            {locationObject.name}
            {locationObject.description}
            Rating: {locationObject.rating.$numberDecimal}
            <button onClick={() => setShowLocationView(false)}>CLOSE</button>
        </div>
    );
}