import { Link } from 'react-router-dom';
import '../styles/Home.css'; 
import penImage from '../assets/pendrawing.png';
import NavBar from '../components/NavBar';

export default function Home() {
  return (
    <div className="homepage">
      <NavBar />

      {/* Main Content */}
      <div className="content">

        {/* Main Container */}
        <div className="main-container">

          {/* App Name */}
          <h1 className="app-title">GSW Study Spots</h1>

          {/* Pen Graphic */}
          <div className="image-container">
            <img className="showcase-image"
              src={penImage}
              alt="Pen Graphic" 
            />
          </div>

          {/* Description Section */}
          <div className="description">
            <h2>Discover Your Perfect Study Space</h2>
            <p>GSW Study Spots helps UCLA students find and share the best study locations on campus. Whether you're looking for a quiet corner in the library, a collaborative space for group projects, or a cozy spot with good coffee, our community-driven platform makes it easy to discover, rate, and review study spots that match your preferences.</p>
          </div>

        </div>
        {/* End of Main Container */}

        {/* Feature Sections */}
        <div className="feature-sections">
          {/* Feature 1 */}
          <div className="feature-section">
            <div className="feature-content">
              <h2>Pinning Spots</h2>
              <p>Users can "pin" or "save" study spots that they find through the application. Pinned locations will remain visible to the user across multiple sessions.</p>
              <p>A user's pinned locations will be stored in the database alongside other user information.</p>
            </div>
            <div className="feature-image">
              <img src="/assets/feature1.png" alt="Feature 1" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-section reverse">
            <div className="feature-content">
              <h2>Recommendation Algorithm</h2>
              <p>Our algorithm would recommend users new study spots to try based on their past history of ratings. It would recommend spots that others with similar ratings have also enjoyed.</p>
            </div>
            <div className="feature-image">
              <img src="/assets/feature2.png" alt="Feature 2" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-section">
            <div className="feature-content">
              <h2>Map Integration</h2>
              <p>We would implement a map view that shows study spots with interactive pins. Users can explore spots geographically and click on map markers to access detailed reviews.</p>
            </div>
            <div className="feature-image">
              <img src="/assets/feature3.png" alt="Feature 3" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}