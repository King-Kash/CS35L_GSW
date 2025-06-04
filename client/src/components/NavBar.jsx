import React, { useState, useEffect } from 'react';
import '../styles/NavBar.css';
import DropdownInput from './DropdownInput';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Store multiple selected tags
  const [tagInput, setTagInput] = useState(''); // Input for typing new tags
  const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);
  const [isTagDropdownVisible, setIsTagDropdownVisible] = useState(false);
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(-1); // Track the highlighted item
  const [highlightedTagIndex, setHighlightedTagIndex] = useState(-1); // Track the highlighted item
  const [width, setWidth] = useState(window.innerWidth);
  const [spots, setSpots] = useState([]); // State to hold spots from database
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch spots from database
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(`${API_URL}/locations/all`);
        if (response.ok) {
          const data = await response.json();
          setSpots(data);
        } else {
          console.error('Failed to fetch locations');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchSpots();
  }, []);

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedSearchIndex(-1);
  }, [searchTerm, spots]);
  
  const tags = ['quiet',
    'group-friendly',
    'wifi',
    'outlets',
    'natural-light',
    'cozy',
    'spacious',
    'coffee',
    'food',
    'late-hours',
    'comfortable-seating',
    'private-rooms',
    'good-lighting',
    'affordable',
    'view',
    'outdoor-seating'
  ];

  const common_searches = [
    'Library',
    'Cafe',
    'Bookstore',
    'Student Union',
    'Lounge',
    'Park',
    'Study Hall',
    'Computer Lab',
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setIsSearchDropdownVisible(true);
    setHighlightedSearchIndex(-1); // Reset highlighted index when search changes
  };

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
    setIsTagDropdownVisible(true); // Show dropdown when typing
    setHighlightedTagIndex(-1); // Reset highlighted index
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]); // Add the selected tag to the array
    }
    setTagInput(''); // Clear the input field
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove)); // Remove the tag
  };

  const handleSearchDropdownClick = (search) => {
    setSearchTerm(search);
    setTimeout(() => setIsSearchDropdownVisible(false), 200);
  };

  const handleSearchButtonClick = () => {
    // TODO: ADJUST AS NEEDED TO ACTUAL SEARCH RESULTS PAGE
    navigate(`/results?search=${searchTerm}&tag=${selectedTags.join(',')}`); // Navigate to search results page
  };

  const handleBlur = (setDropdownVisible) => {
    setTimeout(() => setDropdownVisible(false), 200);
  };

  const handleKeyDown = (event, filteredItems, highlightedIndex, setHighlightedIndex, onItemClick) => {
    if (!filteredItems.length) return;

    if (event.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredItems.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredItems.length - 1
      );
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      onItemClick(filteredItems[highlightedIndex]);
    }
  };

  const filteredSearches = searchTerm.trim() === '' 
    ? common_searches.slice(0, 8)
    : (() => {
        const searchLower = searchTerm.toLowerCase();
        
        // Get matching location names (remove duplicates)
        const matchingLocations = [...new Set(
          spots
            .map((spot) => spot.name)
            .filter((name) => name && name.toLowerCase().includes(searchLower))
        )];
        
        // Get matching common searches
        const matchingCommonSearches = common_searches.filter((search) => 
          search.toLowerCase().includes(searchLower)
        );
        
        // Combine and limit results to prevent overly large dropdown
        const combined = [...matchingLocations, ...matchingCommonSearches];
        return combined.slice(0, 8); // Limit to 8 items maximum
      })();

  const filteredTags = tags
    .filter((tag) => !selectedTags.includes(tag)) // Exclude selected tags
    .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase())); // Filter based on input

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/reviews" className="nav-link">Reviews</Link>
        <Link to="/map" className="nav-link">Map</Link>
        <Link to="/locations" className="nav-link">Locations</Link>
      </div>
      {width > 975 && 
      <div className="search-tag-container">
        <DropdownInput
          value={searchTerm}
          onChange={handleSearchChange}
          onItemClick={handleSearchDropdownClick}
          onFocus={() => setIsSearchDropdownVisible(true)}
          onBlur={() => handleBlur(setIsSearchDropdownVisible)}
          onKeyDown={(event) =>
            handleKeyDown(
              event,
              filteredSearches,
              highlightedSearchIndex,
              setHighlightedSearchIndex,
              handleSearchDropdownClick
            )
          }
          isDropdownVisible={isSearchDropdownVisible}
          filteredItems={filteredSearches}
          highlightedIndex={highlightedSearchIndex}
          placeholder="Search..."
          selectedItems={[]} // No selected items for search input
          onRemoveItem={() => {}} // No remove function for search input
          className="search-wrapper" // Add a class for styling
        />
        <div className="divider"></div>
        {width > 1250 && 
        <div className="tag-input-container">
          <DropdownInput
            value={tagInput}
            onChange={handleTagInputChange}
            onItemClick={handleTagClick}
            onFocus={() => setIsTagDropdownVisible(true)}
            onBlur={() => {handleBlur(setIsTagDropdownVisible)}}
            onKeyDown={(event) =>
              handleKeyDown(
                event,
                filteredTags,
                highlightedTagIndex,
                setHighlightedTagIndex,
                handleTagClick
              )
            }
            isDropdownVisible={isTagDropdownVisible}
            filteredItems={filteredTags}
            highlightedIndex={highlightedTagIndex}
            placeholder="Enter tag..."
            selectedItems={selectedTags} // Pass selected tags to the input
            onRemoveItem={handleTagRemove} // Pass the remove function
            className="tag-wrapper" // Add a class for styling
          />
        </div>}
        <button className="search-button" onClick={handleSearchButtonClick}>
            <FaSearch />
        </button>
        </div>}
        {/* Login/Register Buttons */}
        <div className="auth-buttons">
              {!user ? (
                <>
                  <Link to="/login" className="log-btn">Login</Link>
                  <Link to="/signup" className="reg-btn">Register</Link>
                </>
              ) : (
                  <Link to="/profile" className="profile-btn">Profile</Link>
              )}
        </div>
    </nav>
  );
}