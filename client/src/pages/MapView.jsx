import { useEffect, useRef, useState } from 'react';
import './MapView.css';
import LocationView from './LocationView';
import NavBar from '../components/NavBar';

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
    const mapInstanceRef = useRef(null);
    const [map, setMap] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLocationView, setShowLocationView] = useState(false)
    const [selectedSpot, setSelectedSpot] = useState(null);
    const markersRef = useRef([]);
    const [error, setError] = useState(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const isAddModeRef = useRef(false);
    const tempMarkerRef = useRef(null);
    const [spots, setSpots] = useState(studySpots);
    const [newSpotName, setNewSpotName] = useState('');
    const [newSpotDescription, setNewSpotDescription] = useState('');
    const [newSpotImage, setNewSpotImage] = useState(null);
    const [newSpotRating, setNewSpotRating] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        isAddModeRef.current = isAddMode;
    }, [isAddMode]);

    useEffect(() => {
        mapInstanceRef.current = map;
    }, [map]);

    useEffect(() => {
        // Initialize the map when the component mounts
        const initMap = () => {
            console.log('Initializing map...');
            
            if (!mapRef.current) {
                console.error('Map container not found');
                return;
            }

            try {
                const mapInstance = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 34.0716, lng: -118.4417 }, // Center on UCLA
                    zoom: 15,
                    fullscreenControl: false,
                    mapTypeControl: false,
                    mapId: import.meta.env.VITE_GOOGLE_MAPS_ID
                });
                console.log('Map initialized successfully');
                setMap(mapInstance);
                mapInstanceRef.current = mapInstance;

                // Add markers for study spots
                addStudySpotMarkers(mapInstance);

                // Add click listener for adding new spots
                mapInstance.addListener('click', (e) => {
                    console.log('Map clicked:', e.latLng.toString());
                    handleMapClick(e);
                });
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

    const handleMapClick = (e) => {
        console.log('Map clicked, isAddMode:', isAddModeRef.current);
        if (!isAddModeRef.current || !mapInstanceRef.current) {
            console.log('Cannot add marker: isAddMode =', isAddModeRef.current, 'map =', mapInstanceRef.current);
            return;
        }

        try {
            // Remove previous temporary marker if it exists
            if (tempMarkerRef.current) {
                console.log('Removing previous temporary marker');
                tempMarkerRef.current.setMap(null);
            }

            // Create a new temporary marker using standard Marker
            const marker = new window.google.maps.Marker({
                position: e.latLng,
                map: mapInstanceRef.current,
                title: "New Study Spot",
                draggable: true,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4285F4",  // Google Maps blue
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                    anchor: new window.google.maps.Point(0, 0)
                }
            });

            // Add drag listener to update location
            marker.addListener('dragend', (e) => {
                setSelectedSpot(prev => ({
                    ...prev,
                    location: { lat: e.latLng.lat(), lng: e.latLng.lng() }
                }));
            });

            console.log('Created a new temporary marker');
            tempMarkerRef.current = marker;
            setSelectedSpot({
                id: Date.now(), // Temporary ID
                name: '',
                location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                rating: 0,
                description: ''
            });
            setShowLocationView(true)
            
        } catch (error) {
            console.error('Error creating marker:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewSpotImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRatingChange = (rating) => {
        setNewSpotRating(rating);
    };

    const handleAddSpot = () => {
        if (!selectedSpot || !newSpotName) return;

        console.log("adding")

        setIsAddMode(false)

        try {
            const newSpot = {
                ...selectedSpot,
                name: newSpotName,
                description: newSpotDescription,
                rating: newSpotRating,
                image: imagePreview
            };

            // Convert temporary marker to permanent marker
            if (tempMarkerRef.current) {
                tempMarkerRef.current.setMap(null);
                tempMarkerRef.current = null;
                console.log("DOING SOMETHING WIHT TEMPORARY")
            }

            // Add the new spot to the list
            setSpots(prevSpots => [...prevSpots, newSpot]);
            console.log('Added new spot:', newSpot);

            // Create a permanent marker for the new spot
            const marker = new window.google.maps.Marker({
              position: newSpot.location,
              map: mapInstanceRef.current,
              title: newSpot.name,
              draggable: false
          });
            /*new window.google.maps.Marker({
                position: newSpot.location,
                map: mapInstanceRef.current,
                title: newSpot.name,
                draggable: false,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4285F4",  // Google Maps blue
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                    anchor: new window.google.maps.Point(0, 0)
                }
            });*/

            // Create info window with image
            const infoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div class="info-window">
                        <h3>${newSpot.name}</h3>
                        ${newSpot.image ? `<img src="${newSpot.image}" alt="${newSpot.name}" style="max-width: 200px; margin: 10px 0;">` : ''}
                        <p>Rating: ${'⭐'.repeat(newSpot.rating)}</p>
                        <p>${newSpot.description}</p>
                    </div>
                `
            });

            // Add click listener
            marker.addListener('click', () => {
                // Close any open info windows
                markersRef.current.forEach(m => {
                    if (m.infoWindow) {
                        m.infoWindow.close();
                    }
                });

                // Open this marker's info window
                //infoWindow.open(mapInstanceRef.current, marker);
                setShowLocationView(true)
                setSelectedSpot(newSpot);
          
            });

            // Store marker and its info window
            marker.infoWindow = infoWindow;
            markersRef.current.push(marker);
            
            // Reset form
            setNewSpotName('');
            setNewSpotDescription('');
            setSelectedSpot(newSpot);

            setNewSpotImage(null);
            setNewSpotRating(0);
            setImagePreview(null);

        } catch (error) {
            console.error('Error adding spot:', error);
        }
    };

    const addStudySpotMarkers = (map) => {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add new markers
        spots.forEach(spot => {
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
                //infoWindow.open(map, markerView);
                setSelectedSpot(spot);
                setShowLocationView(true)
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

    const toggleMode = () => {
        console.log('Toggling mode. Current isAddMode:', isAddMode);
        setIsAddMode(prevMode => {
            const newMode = !prevMode;
            console.log('New mode will be:', newMode);
            return newMode;
        });
        
        // Clear any temporary marker when toggling modes
        if (tempMarkerRef.current) {
            console.log('Removing temporary marker when toggling modes');
            tempMarkerRef.current.setMap(null);
            tempMarkerRef.current = null;
        }
        setSelectedSpot(null);
        setNewSpotName('');
        setNewSpotDescription('');
        setNewSpotImage(null);
        setNewSpotRating(0);
        setImagePreview(null);
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

    console.log("opening")
    console.log(selectedSpot)

    return (
        <div className="mapview-container">
            <NavBar />
            <div className="mapview-content">

                {showLocationView && <LocationView selectedSpot={selectedSpot} setShowLocationView={setShowLocationView} />}
                
                {/*<button className="add-button" onClick={() => setShowLocationView(!showLocationView)}>Add Study Spot</button>*/}
                <div className="controls">
                    {/*<form className="search-box" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for a location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>*/}
                    <button 
                        className={`mode-toggle ${isAddMode ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            console.log('Mode toggle button clicked. Current mode:', isAddMode);
                            toggleMode();
                            setShowLocationView(false)
                        }}
                    >
                        {isAddMode ? 'Cancel' : 'Add Spot'}
                    </button>
                </div>
                <div className="map-container">
                    <div ref={mapRef} className="map"></div>
                </div>
                {isAddMode && (
                  <div>
                  {selectedSpot ? (
                    <div className="add-spot-form">
                        <div className="add-spot-flex-box">
                          <h2>Add New Study Spot</h2>
                          <input
                              type="text"
                              className="add-spot-name"
                              placeholder="Name of the study spot"
                              value={newSpotName}
                              onChange={(e) => setNewSpotName(e.target.value)}
                          />
                          <textarea
                              className="add-spot-description"
                              placeholder="Description"
                              value={newSpotDescription}
                              onChange={(e) => setNewSpotDescription(e.target.value)}
                              maxLength={200}
                          />
                          <div className="image-placeholder">
                              <div className="image-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        id="spot-image"
                                    />
                                    {imagePreview && (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                        </div>
                                    )}
                                </div>
                          </div>
                          
                          <button onClick={handleAddSpot}>Add Spot</button>
                        </div>
                     </div>
                      ) : (
                        <div className="add-spot-guide">
                          <h3>Add New Study Spot</h3> 
                          <p>Click on the map to add a new study spot</p>
                        </div>
                      )}
                  </div>
                )}
                {/*!isAddMode && selectedSpot && (
                    <div className="spot-details">
                        <h3>{selectedSpot.name}</h3>
                        {selectedSpot.image && (
                            <img src={selectedSpot.image} alt={selectedSpot.name} className="spot-image" />
                        )}
                        <p>Rating: {'⭐'.repeat(selectedSpot.rating)}</p>
                        <p>{selectedSpot.description}</p>
                    </div>
                )*/}
            </div>
        </div>
    );
}