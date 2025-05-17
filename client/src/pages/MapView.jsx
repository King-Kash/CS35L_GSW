import { useEffect, useRef, useState } from 'react';
import './MapView.css';

// Sample study spots data - you can replace this with data from your backend
const studySpots = [
    {
        id: 1,
        name: "Powell Library",
        location: { lat: 34.0716, lng: -118.4417 },
        rating: 4.5,
        description: "UCLA's main library, open 24/7 during finals"
    },
    {
        id: 2,
        name: "Young Research Library",
        location: { lat: 34.0747, lng: -118.4397 },
        rating: 4.3,
        description: "Quiet study spaces and group study rooms"
    },
    {
        id: 3,
        name: "Ackerman Union",
        location: { lat: 34.0712, lng: -118.4453 },
        rating: 4.0,
        description: "Food court and study spaces"
    }
];

export default function MapView() {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpot, setSelectedSpot] = useState(null);
    const markersRef = useRef([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initialize the map when the component mounts
        const initMap = () => {
            console.log('Initializing map...');
            
            if (!mapRef.current) {
                console.error('Map container not found');
                return;
            }

            try {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 34.0716, lng: -118.4417 }, // Center on UCLA
                    zoom: 15,
                    mapId: import.meta.env.VITE_GOOGLE_MAPS_ID, // Add your Map ID here
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ]
                });
                console.log('Map initialized successfully');
                setMap(map);

                // Add markers for study spots
                addStudySpotMarkers(map);
            } catch (error) {
                console.error('Error initializing map:', error);
                setError('Failed to initialize map. Please check your API key and Map ID.');
            }
        };

        // Load the Google Maps script
        const loadGoogleMapsScript = () => {
            console.log('Loading Google Maps script...');
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
            
            if (!apiKey) {
                setError('Google Maps API key is missing. Please check your .env file.');
                return;
            }

            if (!mapId) {
                setError('Google Maps ID is missing. Please check your .env file.');
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=beta`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('Google Maps script loaded successfully');
                initMap();
            };
            script.onerror = (error) => {
                console.error('Error loading Google Maps script:', error);
                setError('Failed to load Google Maps. Please check your internet connection and API key.');
            };
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();

        // Cleanup function
        return () => {
            const script = document.querySelector('script[src*="maps.googleapis.com"]');
            if (script) {
                document.head.removeChild(script);
            }
            // Clear markers
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
        };
    }, []);

    const addStudySpotMarkers = (map) => {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add new markers
        studySpots.forEach(spot => {
            // Create marker element
            const markerView = new window.google.maps.marker.AdvancedMarkerElement({
                map,
                position: spot.location,
                title: spot.name,
            });

            // Create info window
            const infoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div class="info-window">
                        <h3>${spot.name}</h3>
                        <p>Rating: ${spot.rating} ⭐</p>
                        <p>${spot.description}</p>
                    </div>
                `
            });

            // Add click listener
            markerView.addListener('click', () => {
                // Close any open info windows
                markersRef.current.forEach(m => {
                    if (m.infoWindow) {
                        m.infoWindow.close();
                    }
                });

                // Open this marker's info window
                infoWindow.open(map, markerView);
                setSelectedSpot(spot);
            });

            // Store marker and its info window
            markerView.infoWindow = infoWindow;
            markersRef.current.push(markerView);
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!map || !searchQuery) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, (results, status) => {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                map.setCenter(location);
                map.setZoom(15);
            }
        });
    };

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <p>Please check your API key and Map ID in the .env file and make sure they're valid.</p>
            </div>
        );
    }

    return (
        <div className="mapview-container">
            <div className="mapview-content">
                <form className="search-box" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for a location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                <div className="map-container">
                    <div ref={mapRef} className="map"></div>
                </div>
                {selectedSpot && (
                    <div className="spot-details">
                        <h3>{selectedSpot.name}</h3>
                        <p>Rating: {selectedSpot.rating} ⭐</p>
                        <p>{selectedSpot.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}