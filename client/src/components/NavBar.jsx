import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './NavBar.css';

export default function Navbar() {
  const [tagTerm, setTagTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Track the highlighted item
  const navigate = useNavigate();

  const tags = ['quiet', 'aesthetic', 'good for collaboration', 'any']; // Some sample tags

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // TODO: implement search autofill logic
  };

  const handleTagChange = (event) => {
    setTagTerm(event.target.value);
    setIsDropdownVisible(true); // Show dropdown when typing
    setHighlightedIndex(-1); // Reset highlighted index
  };

  const handleSearchClick = () => {
    // TODO: ADJUST AS NEEDED TO ACTUAL SEARCH RESULTS PAGE
    navigate(`/results?search=${searchTerm}&tag=${tagTerm}`); // Navigate to search results page
  };

  const handleTagClick = (tag) => {
    setTagTerm(tag); // Populate the input with the selected tag
    setIsDropdownVisible(false); // Hide dropdown after selecting a tag
  };

  const handleBlur = () => {
    setTimeout(() => setIsDropdownVisible(false), 100); // Delay to allow click event on dropdown items
  };

  const handleFocus = () => {
    setIsDropdownVisible(true); // Show dropdown when input is focused
  };

  const handleKeyDown = (event) => {
    if (!isDropdownVisible || filteredTags.length === 0) return;

    if (event.key === 'ArrowDown') {
      // Move down the list
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredTags.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      // Move up the list
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredTags.length - 1
      );
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      // Select the highlighted item
      handleTagClick(filteredTags[highlightedIndex]);
    }
  };

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
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="divider"></div>
        <div className="dropdown-container">
          <input
            type="text"
            placeholder="Enter tag..."
            value={tagTerm}
            onChange={handleTagChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="tag-input"
          />
          {isDropdownVisible && (
            <ul className="dropdown">
              {filteredTags.map((tag, index) => (
                <li
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`dropdown-item ${
                    index === highlightedIndex ? 'highlighted' : ''
                  }`}
                >
                  {tag}
                </li>
              ))}
              {filteredTags.length === 0 && (
                <li className="dropdown-item no-matches unclickable">
                  No matches
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
      <button className="search-button" onClick={handleSearchClick}>
          Search
      </button>
    </nav>
  );
}