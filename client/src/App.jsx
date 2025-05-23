import './App.css'

import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Reviews from './pages/Reviews';
import MapView from './pages/MapView';
import Profile from './pages/Profile';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
