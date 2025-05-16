import { useState } from 'react';
import '../styles/Reviews.css'; 

export default function Reviews() {
  // Sample reviews data
  const [reviews] = useState([
    {
      id: 1,
      username: "JaneSmith",
      locationName: "Koreatown Cafe",
      rating: 4,
      content: "Great atmosphere and friendly staff. The coffee was excellent, and they have good WiFi. Perfect spot for studying.",
      createdAt: "2025-04-15T14:30:00Z",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      username: "MikeBrown",
      locationName: "Westwood Diner",
      rating: 5,
      content: "Absolutely loved this place! The food was amazing, especially their pancakes. It can get crowded on weekends, so go early.",
      createdAt: "2025-04-02T18:45:00Z",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      username: "AlexJohnson",
      locationName: "Powell Library",
      rating: 3,
      content: "A decent study spot but can get really packed during finals week. The ambient noise can be distracting at times.",
      createdAt: "2025-03-20T10:15:00Z",
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      username: "SarahLee",
      locationName: "Bruin Plate Dining Hall",
      rating: 4,
      content: "One of the best dining halls on campus. The food is fresh and they have plenty of healthy options.",
      createdAt: "2025-03-10T12:30:00Z",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 5,
      username: "DavidWong",
      locationName: "Ackerman Union",
      rating: 4,
      content: "Great central location with lots of food options. Can get crowded during lunch hours but overall a nice place to meet friends.",
      createdAt: "2025-02-25T15:10:00Z", 
      image: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 6,
      username: "EmilyWilson",
      locationName: "Kerckhoff Coffee House",
      rating: 5,
      content: "My favorite spot on campus! The atmosphere is cozy, coffee is great, and it's perfect for both studying and socializing.",
      createdAt: "2025-02-10T12:30:00Z",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 7,
      username: "ChrisTaylor",
      locationName: "Ackerman Union",
      rating: 3,
      content: "It's okay, but can get really crowded. The food court has decent options though some are overpriced.",
      createdAt: "2025-02-05T11:20:00Z",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 8,
      username: "LisaGarcia",
      locationName: "Koreatown Cafe",
      rating: 5,
      content: "Hidden gem! Amazing pastries and the iced matcha latte is to die for. Great spot for a casual meeting or studying.",
      createdAt: "2025-01-28T09:15:00Z",
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"
    },
    {
      id: 9,
      username: "RyanParker",
      locationName: "Powell Library",
      rating: 4,
      content: "Classic study spot with great ambiance. Can get busy but if you go early you can usually find a good spot.",
      createdAt: "2025-01-15T16:45:00Z",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ]);

  // Filter states
  const [ratingFilter, setRatingFilter] = useState(0);
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Get unique locations for filter dropdown
  const locations = [...new Set(reviews.map(review => review.locationName))];

  // Apply filters
  const filteredReviews = reviews.filter(review => {
    // Filter by rating
    if (ratingFilter > 0 && review.rating < ratingFilter) {
      return false;
    }
    
    // Filter by location
    if (locationFilter && review.locationName !== locationFilter) {
      return false;
    }
    
    // Filter by date (last month, last week, etc.)
    if (dateFilter) {
      const reviewDate = new Date(review.createdAt);
      const currentDate = new Date();
      
      if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(currentDate.getDate() - 7);
        if (reviewDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(currentDate.getMonth() - 1);
        if (reviewDate < monthAgo) return false;
      } else if (dateFilter === '3months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        if (reviewDate < threeMonthsAgo) return false;
      }
    }
    
    return true;
  });

  const clearFilters = () => {
    setRatingFilter(0);
    setLocationFilter('');
    setDateFilter('');
  };

  return (
    <div className="reviews-page">
      <div className="reviews-container">
        <div className="filter-column">
          <div className="filter-card">
            <h2>Filters</h2>
            
            <div className="filter-section">
              <h3>Minimum Rating</h3>
              <div className="rating-filter">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span 
                    key={rating}
                    className={`filter-star ${rating <= ratingFilter ? "selected" : ""}`}
                    onClick={() => setRatingFilter(rating === ratingFilter ? 0 : rating)}
                  >
                    ★
                  </span>
                ))}
                {ratingFilter > 0 && <span className="rating-text">({ratingFilter}+ stars)</span>}
              </div>
            </div>

            <div className="filter-section">
              <h3>Location</h3>
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h3>Time Period</h3>
              <div className="date-filter-options">
                <label>
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === 'week'}
                    onChange={() => setDateFilter('week')}
                  />
                  Last Week
                </label>
                <label>
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === 'month'}
                    onChange={() => setDateFilter('month')}
                  />
                  Last Month
                </label>
                <label>
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === '3months'}
                    onChange={() => setDateFilter('3months')}
                  />
                  Last 3 Months
                </label>
                <label>
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={dateFilter === ''}
                    onChange={() => setDateFilter('')}
                  />
                  All Time
                </label>
              </div>
            </div>

            <button className="clear-filters-button" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>

        <div className="reviews-content">
          <h1 className="reviews-heading">Community Reviews</h1>
          
          {filteredReviews.length === 0 ? (
            <p className="no-reviews">No reviews match your filters.</p>
          ) : (
            <div className="reviews-list">
              {filteredReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-main-content">
                    <div className="review-header">
                      <h3 className="review-location">{review.locationName}</h3>
                      <span className="review-username">by {review.username}</span>
                    </div>
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
  );
}