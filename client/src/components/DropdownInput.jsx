import React from 'react';

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
}) {
  return (
    <div className="dropdown-container">
      <input
        type="text"
        placeholder={placeholder}
        className="dropdown-input"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
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