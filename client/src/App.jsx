import './App.css'

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Reviews from './pages/Reviews';
import MapView from './pages/MapView';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </>
  )
}

export default App
