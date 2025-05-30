import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import NavBar from '../components/NavBar';

export default function Profile() {
  const navigate = useNavigate();
  
  // sample user data
  const [user] = useState({
    id: 1,
    name: "Name",
    email: "jane.smith@example.com",
    profilePicture: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    description: "description"
  });

  // sample reviews data with photos
  const [reviews] = useState([
    {
      id: 1,
      locationName: "Koreatown Cafe",
      rating: 4,
      content: "Great atmosphere and friendly staff. The coffee was excellent, and they have good WiFi. Perfect spot for studying.",
      createdAt: "2025-04-15T14:30:00Z",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      locationName: "Westwood Diner",
      rating: 5,
      content: "Absolutely loved this place! The food was amazing, especially their pancakes. It can get crowded on weekends, so go early.",
      createdAt: "2025-04-02T18:45:00Z",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      locationName: "Powell Library",
      rating: 3,
      content: "A decent study spot but can get really packed during finals week. The ambient noise can be distracting at times.",
      createdAt: "2025-03-20T10:15:00Z",
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      locationName: "Bruin Plate Dining Hall",
      rating: 4,
      content: "One of the best dining halls on campus. The food is fresh and they have plenty of healthy options.",
      createdAt: "2025-03-10T12:30:00Z",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 5,
      locationName: "Ackerman Union",
      rating: 4,
      content: "Great central location with lots of food options. Can get crowded during lunch hours but overall a nice place to meet friends.",
      createdAt: "2025-02-25T15:10:00Z", 
      image: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 6,
      locationName: "Kerckhoff Coffee House",
      rating: 5,
      content: "My favorite spot on campus! The atmosphere is cozy, coffee is great, and it's perfect for both studying and socializing.",
      createdAt: "2025-02-10T12:30:00Z",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ]);

  const handleLogout = () => {
    // For now, just navigate to the login page
    alert("Logout clicked");
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // For now, just navigate to the login page
      alert("Account deleted");
      navigate('/login');
    }
  };

  return (
    <div className="profile-page">
      <NavBar />
      <div className="profile-container">
        <div className="profile-left-column">
          <div className="profile-card">
            <div className="profile-image-container">
              <img 
                src={user.profilePicture || '/default-avatar.png'} 
                alt="Profile" 
                className="profile-image" 
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
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-main-content">
                      <h3 className="review-location">{review.locationName}</h3>
                      <div className="review-rating">
                        {Array(5).fill().map((_, i) => (
                          <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                        ))}
                      </div>
                      <p className="review-content">{review.content}</p>
                      <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="review-image-container">
                      <img 
                        src={review.image} 
                        alt={review.locationName}
                        className="review-image" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}