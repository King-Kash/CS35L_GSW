import { Link } from 'react-router-dom';
import '../styles/Home.css'; 
import penImage from '../assets/pendrawing.png';
import NavBar from '../components/NavBar';
import Feature1 from '../assets/feature1.png';
import Feature2 from '../assets/feature2.png';
import Feature3 from '../assets/feature3.png';
import { FaMapMarkerAlt, FaSearch, FaStar, FaBookmark } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="homepage">
      <NavBar />

      {/* Main Content */}
      <div className="content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Find Your Perfect Study Space at UCLA</h1>
          <p className="hero-subtitle">Discover, review, and share the best study spots on campus</p>
        </div>

        {/* Main Container */}
        <div className="main-container">
          {/* App Name */}
          <h1 className="app-title">GSW Study Spots</h1>

          {/* Pen Graphic */}
          <div className="image-container">
            <div className="image-overlay">
              <div className="stats-container">
                <div className="stat-item">
                  <span className="stat-number">30+</span>
                  <span className="stat-label">Study Locations</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">30+</span>
                  <span className="stat-label">User Reviews</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.7</span>
                  <span className="stat-label">Average Rating</span>
                </div>
              </div>
            </div>
            <img className="showcase-image"
              src={penImage}
              alt="Study Spots" 
            />
          </div>

          {/* Description Section */}
          <div className="description">
            <h2>Discover Your Perfect Study Space</h2>
            <p>GSW Study Spots helps UCLA students find and share the best study locations on campus. Whether you're looking for a quiet corner in the library, a collaborative space for group projects, or a cozy spot with good coffee, our community-driven platform makes it easy to discover, rate, and review study spots that match your preferences.</p>
            <div className="feature-highlights">
              <div className="highlight-item">
                <FaSearch className="highlight-icon" />
                <span>Find study spots by tags and ratings</span>
              </div>
              <div className="highlight-item">
                <FaStar className="highlight-icon" />
                <span>Rate and review your experiences</span>
              </div>
              <div className="highlight-item">
                <FaBookmark className="highlight-icon" />
                <span>Save your favorite locations</span>
              </div>
              <div className="highlight-item">
                <FaMapMarkerAlt className="highlight-icon" />
                <span>Locate spots on an interactive map</span>
              </div>
            </div>
          </div>
        </div>
        {/* End of Main Container */}

        {/* Feature Sections */}
        <div className="feature-sections">
          <h2 className="features-title">What Makes GSW Study Spots Special</h2>
          
          {/* Feature 1 */}
          <div className="feature-section">
            <div className="feature-content">
              <span className="feature-badge">Feature</span>
              <h2>Save Your Favorite Spots</h2>
              <p>Easily bookmark and organize your go-to study locations across campus. Your pinned spots will remain accessible whenever you log in, making it simple to return to your preferred study environments.</p>
              <p>A user's pinned locations will be stored in the database alongside other user information.</p>
              <Link to="/locations" className="feature-link">Try it now →</Link>
            </div>
            <div className="feature-image">
              <img src={Feature1} alt="Pinning study locations feature" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-section reverse">
            <div className="feature-content">
              <span className="feature-badge">Feature</span>
              <h2>Personalized Recommendations</h2>
              <p>Our smart algorithm analyzes your preferences based on your ratings and behavior to suggest study spots you're likely to enjoy. Discover new locations that match your study style without the guesswork.</p>
              <Link to="/locations" className="feature-link">Get recommendations →</Link>
            </div>
            <div className="feature-image">
              <img src={Feature2} alt="Personalized study spot recommendations" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-section">
            <div className="feature-content">
              <span className="feature-badge">Feature</span>
              <h2>Interactive Campus Map</h2>
              <p>Visualize study locations across UCLA's campus with our interactive map. Quickly find spots near your current location or next class, and click on map markers to see ratings, reviews, and details about each location.</p>
              <Link to="/map-view" className="feature-link">Open map view →</Link>
            </div>
            <div className="feature-image">
              <img src={Feature3} alt="Interactive campus map with study locations" />
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="cta-section">
            <h2>Ready to find your perfect study spot?</h2>
            <p>Join UCLA students who are discovering and sharing the best places to study on campus.</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button">Sign Up Now</Link>
              <Link to="/locations" className="cta-button secondary">Browse Locations</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}