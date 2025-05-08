import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <div>
        <Link to="/">Home</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/map">Map</Link>
      </div>
      <div>
        <input type="text" placeholder="Search..." />
      </div>
    </nav>
  );
}
