import './App.css'
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Reviews from './pages/Reviews';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddReview from './pages/AddReview';

function App() {
  return (
    <div className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-review" element={<AddReview />} />
      </Routes>
    </div>
  );
}

export default App;
