import './App.css'
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Reviews from './pages/Reviews';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import Locations from './pages/Locations';
import LocationView from './pages/LocationView';
import Review from './pages/Review';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/map" element={<MapView />}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/location-view/:locationId" element={<LocationView />} />
        <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
      </Routes>
      </AuthProvider>

  );
}

export default App;
