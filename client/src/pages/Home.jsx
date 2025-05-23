import { Link } from 'react-router-dom';
import './Home.css'; // We'll create this CSS file for styling
import NavBar from '../components/NavBar'; // Import the NavBar component

export default function Home() {
  return (
    <div className="home-container">
      <NavBar />
      <div className="auth-buttons">
        <Link to="/login" className="auth-btn">Login</Link>
        <Link to="/register" className="auth-btn">Register</Link>
      </div>
      
      <div className="content">
        <h1 className="app-title">Study Spot Reviewer</h1>
        <div className="image-container">
          <img 
            src="/path-to-your-image.jpg" 
            alt="App showcase" 
            className="showcase-image"
          />
        </div>
      </div>
    </div>
  );
}