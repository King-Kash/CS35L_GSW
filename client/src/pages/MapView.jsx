import { useEffect, useRef, useState } from 'react';
import './MapView.css';

export default function MapView() {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Initialize the map when the component mounts
        const initMap = () => {
            console.log('Initializing map...');
            console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
            
            if (!mapRef.current) {
                console.error('Map container not found');
                return;
            }

            try {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 34.0522, lng: -118.2437 }, // Default to Los Angeles
                    zoom: 12,
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
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        // Load the Google Maps script
        const loadGoogleMapsScript = () => {
            console.log('Loading Google Maps script...');
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('Google Maps script loaded successfully');
                initMap();
            };
            script.onerror = (error) => {
                console.error('Error loading Google Maps script:', error);
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
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!map || !searchQuery) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, (results, status) => {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                map.setCenter(location);
                map.setZoom(15);

                // Add a marker
                new window.google.maps.Marker({
                    map,
                    position: location,
                    title: searchQuery
                });
            }
        });
    };

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
            </div>
        </div>
    );
}