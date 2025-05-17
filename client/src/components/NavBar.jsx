import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './NavBar.css';
import DropdownInput from './DropdownInput';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagTerm, setTagTerm] = useState('');
  const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);
  const [isTagDropdownVisible, setIsTagDropdownVisible] = useState(false);
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(-1); // Track the highlighted item
  const [highlightedTagIndex, setHighlightedTagIndex] = useState(-1); // Track the highlighted item
  const navigate = useNavigate();
  
  const tags = ['quiet', 'aesthetic', 'good for collaboration', 'any']; // Some sample tags
  const spots = [ {
    "location": {
        "type": "Point",
        "coordinates": [
            -118.2437,
            34.0522
        ]
    },
    "_id": "6828d5c6590e03c2a8fb3e68",
    "name": "Peets Coffee",
    "rating": {
        "$numberDecimal": "4.5"
    },
    "reviews": [],
    "image": "https://example.com/new-image.jpg",
    "description": "This is an updated description of the location.",
    "tags": ["library", "quiet", "crowded"],
    "createdAt": "2025-05-17T18:30:30.767Z",
    "updatedAt": "2025-05-17T18:39:34.332Z",
    "__v": 0
  } ,
  {
    "location": {
        "type": "Point",
        "coordinates": [
            -118.2437,
            34.0522
        ]
    },
    "_id": "6828d5c6590e03c2a8fb3e68",
    "name": "Quiet Library",
    "rating": {
        "$numberDecimal": "4.5"
    },
    "reviews": [],
    "image": "https://example.com/new-image.jpg",
    "description": "This is an updated description of the location.",
    "tags": ["library", "quiet", "crowded"],
    "createdAt": "2025-05-17T18:30:30.767Z",
    "updatedAt": "2025-05-17T18:39:34.332Z",
    "__v": 0
  }];
  const common_searches = ['library', 'coffee shop', 'study spot', 'quiet place']; // Some sample searches

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setIsSearchDropdownVisible(true);
    setHighlightedSearchIndex(-1);
  };

  const handleTagChange = (event) => {
    setTagTerm(event.target.value);
    setIsTagDropdownVisible(true); // Show dropdown when typing
    setHighlightedTagIndex(-1); // Reset highlighted index
  };

  const handleSearchDropdownClick = (search) => {
    setSearchTerm(search);
    setIsSearchDropdownVisible(false);
  };

  const handleSearchButtonClick = () => {
    // TODO: ADJUST AS NEEDED TO ACTUAL SEARCH RESULTS PAGE
    navigate(`/results?search=${searchTerm}&tag=${tagTerm}`); // Navigate to search results page
  };

  const handleTagClick = (tag) => {
    setTagTerm(tag); // Populate the input with the selected tag
    setIsTagDropdownVisible(false); // Hide dropdown after selecting a tag
  };

  const handleBlur = (setDropdownVisible) => {
    setTimeout(() => setDropdownVisible(false), 100);
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

  const filteredSearches = [
    ...spots
      .map((spot) => spot.name) // Extract names from the spots array
      .filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    ...common_searches.filter((search) =>
      search.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ];

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(tagTerm.toLowerCase())
  );

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/reviews" className="nav-link">Reviews</Link>
        <Link to="/map" className="nav-link">Map</Link>
      </div>
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
              handleSearchClick
            )
          }
          isDropdownVisible={isSearchDropdownVisible}
          filteredItems={filteredSearches}
          highlightedIndex={highlightedSearchIndex}
          placeholder="Search..."
        />
        <div className="divider"></div>
        <DropdownInput
          value={tagTerm}
          onChange={handleTagChange}
          onItemClick={handleTagClick}
          onFocus={() => setIsTagDropdownVisible(true)}
          onBlur={() => handleBlur(setIsTagDropdownVisible)}
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
        />
      </div>
      <button className="search-button" onClick={handleSearchButtonClick}>
          Search
      </button>
    </nav>
  );
}