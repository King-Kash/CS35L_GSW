import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import NavBar from '../components/NavBar';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import PinnedLocations from '../components/PinnedLocations';

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, setUser, checkAuth } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  const handleViewLocation = (locationId) => {
    if (locationId) {
      navigate(`/location-view/${locationId}`);
    } else {
      alert('Location ID not available');
    }
  };

  const normalizeReview = (review) => {
    return {
      id: review._id || review.id,
      username: review.user?.username || review.user?.name || review.username,
      locationName: review.location?.name || review.locationName,
      locationId: review.location?._id,
      rating: review.rating,
      content: review.contents || review.content,
      createdAt: review.timestamp || review.createdAt,
      image: review.image || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: review.tags || []
    };
  }

  const filterReviews = async () => {
    try {
      const res = await axios.get(API_URL + '/reviews/', {
        withCredentials: true
      });
      const userReviews = res.data.filter(review => 
        String(review.user._id) === user.id
      );
      setReviews(userReviews);
      console.log(reviews)
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/images/profile`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.imageUrl) {
        const updateResponse = await axios.put(
          `${import.meta.env.VITE_API_URL}/users/profile-picture`,
          { profilePicture: data.imageUrl },
          { withCredentials: true }
        );

        if (updateResponse.data) {
          setUser(prevUser => ({
            ...prevUser,
            profilePicture: data.imageUrl
          }));
        }
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    }
  };

  const handleLogout = async () => {
    // For now, just navigate to the login page
    try {
      await axios.delete(API_URL + '/logout', {
        withCredentials: true,
      });
      navigate('/');
      await checkAuth();
    } catch (err) {
      console.error("Logout Failed:", err);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // For now, just navigate to the login page
      alert("Account deleted");
      navigate('/login');
    }
  };

  useEffect(() => {
    if (user) {
      filterReviews();
    }
  }, [user]);

  return (
    <div className="profile-page">
      <NavBar />
      <div className="profile-container">
        <div className="profile-left-column">
          <div className="profile-card">
            <div 
              className="profile-image-container"
              onClick={handleProfilePictureClick}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={user.profilePicture || '/default-avatar.png'} 
                alt="Profile" 
                className="profile-image" 
              />
              <div className="profile-image-overlay">
                <span>Click to change picture</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            
            <h2 className="profile-name">{user.name}</h2>
            
            <div className="profile-description">
              {user.description || 'No description provided.'}
            </div>
          </div>
          
          <div className="profile-actions">
            <button 
              className="profile-button logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
            
            <button 
              className="profile-button delete-button" 
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
        
        <div className="profile-divider"></div>
        
        <div className="profile-right-column">
          <h2 className="reviews-heading">Reviews</h2>
          
          <div className="reviews-container">
            {reviews.length === 0 ? (
              <p className="no-reviews">You haven't written any reviews yet.</p>
            ) : (
              <div className="reviews-list-2">
                {reviews.map(review => {
                  const normalizedReview = normalizeReview(review);
                  return (
                    <div key={normalizedReview.id} className="review-card">
                    <div className="review-info">
                      <h3 className="review-location">{normalizedReview.locationName}</h3>
                      <span className="review-username">by {normalizedReview.username}</span>
                      <span className="review-city-state">{normalizedReview.cityState}</span>
                      
                      {/* Tags moved here - between username and rating */}
                      {normalizedReview.tags && normalizedReview.tags.length > 0 && (
                        <div className="review-tags">
                          {normalizedReview.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="review-tag"
                              onClick={() => setTagFilter(tag === tagFilter ? '' : tag)}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="review-rating">
                        {Array(5).fill().map((_, i) => (
                          <span key={i} className={i < normalizedReview.rating ? "star filled" : "star"}>★</span>
                        ))}
                      </div>
                      <button 
                          className="view-location-button"
                          onClick={() => handleViewLocation(normalizedReview.locationId)}
                        >
                          View Location
                        </button>
                    </div>
                    
                    <div className="review-main-content">
                      <div className="review-content">
                        <p>{normalizedReview.content}</p>
                        <span className="review-date">
                          {new Date(normalizedReview.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="review-image-container">
                      <img 
                        src={normalizedReview.image} 
                        alt={normalizedReview.locationName}
                        className="review-image" 
                      />
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
          
          <PinnedLocations />
        </div>
      </div>
    </div>
  );
}






  // // sample user data
  // const [user, setUser] = useState({
  //   id: 1,
  //   name: "Name",
  //   email: "jane.smith@example.com",
  //   profilePicture: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
  //   description: "description"
  // });

  // sample reviews data with photos
  // const [reviews] = useState([
  //   {
  //     id: 1,
  //     locationName: "Koreatown Cafe",
  //     rating: 4,
  //     content: "Great atmosphere and friendly staff. The coffee was excellent, and they have good WiFi. Perfect spot for studying.",
  //     createdAt: "2025-04-15T14:30:00Z",
  //     image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  //   },
  //   {
  //     id: 2,
  //     locationName: "Westwood Diner",
  //     rating: 5,
  //     content: "Absolutely loved this place! The food was amazing, especially their pancakes. It can get crowded on weekends, so go early.",
  //     createdAt: "2025-04-02T18:45:00Z",
  //     image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  //   },
  //   {
  //     id: 3,
  //     locationName: "Powell Library",
  //     rating: 3,
  //     content: "A decent study spot but can get really packed during finals week. The ambient noise can be distracting at times.",
  //     createdAt: "2025-03-20T10:15:00Z",
  //     image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  //   },
  //   {
  //     id: 4,
  //     locationName: "Bruin Plate Dining Hall",
  //     rating: 4,
  //     content: "One of the best dining halls on campus. The food is fresh and they have plenty of healthy options.",
  //     createdAt: "2025-03-10T12:30:00Z",
  //     image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  //   },
  //   {
  //     id: 5,
  //     locationName: "Ackerman Union",
  //     rating: 4,
  //     content: "Great central location with lots of food options. Can get crowded during lunch hours but overall a nice place to meet friends.",
  //     createdAt: "2025-02-25T15:10:00Z", 
  //     image: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  //   },
  //   {
  //     id: 6,
  //     locationName: "Kerckhoff Coffee House",
  //     rating: 5,
  //     content: "My favorite spot on campus! The atmosphere is cozy, coffee is great, and it's perfect for both studying and socializing.",
  //     createdAt: "2025-02-10T12:30:00Z",
  //     image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  //   }
  // ]);