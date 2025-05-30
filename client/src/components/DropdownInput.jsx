import React from 'react';
import './NavBar.css';

export default function DropdownInput({
  value,
  onChange,
  onItemClick,
  onFocus,
  onBlur,
  onKeyDown,
  isDropdownVisible,
  filteredItems,
  highlightedIndex,
  placeholder,
  selectedItems = [], // Array of selected items (tags)
  onRemoveItem, // Callback to remove a selected item
  className, // Additional class names for styling
}) {
  return (
    <div className="dropdown-container">
      <div className={className}>
        {selectedItems.map((item) => (
          <span key={item} className="tag">
            {item}
            <button
              type="button"
              className="remove-tag-button"
              onClick={() => onRemoveItem(item)}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder={selectedItems.length === 0 ? placeholder : ''}
          className="dropdown-input"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </div>
      {isDropdownVisible && (
        <ul className="dropdown">
          {filteredItems.slice(0, 5).map((item, index) => (
            <li
              key={item}
              onClick={() => onItemClick(item)}
              className={`dropdown-item ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
            >
              {item}
            </li>
          ))}
          {filteredItems.length === 0 && (
            <li className="dropdown-item no-matches unclickable">
              No matches
            </li>
          )}
        </ul>
      )}
    </div>
  );
}