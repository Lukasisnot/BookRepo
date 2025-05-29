// SearchBar.js
import React, { useState, useEffect, useRef } from 'react';

// Helper to get a value from an object using a dot-separated path string
const getValueFromNestedKey = (obj, path) => {
  if (!obj || typeof path !== 'string') {
    return undefined;
  }
  // Split the path into an array of keys
  const keys = path.split('.');
  // Reduce the keys to traverse the object
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      // Path does not exist or intermediate value is not an object
      return undefined;
    }
  }
  return result;
};

// Helper for shallow array comparison (remains the same)
const areArraysShallowlyEqual = (arr1, arr2) => {
  if (arr1 === arr2) return true;
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

const SearchBar = ({
  dataSource,
  searchKeys, // Array of keys (can be nested like 'author.name') to search in each object
  onSearchResults,
  placeholder = "Search...",
  ariaLabel = "Search items",
  initialSearchTerm = "",
  wrapperClassName = "w-full sm:w-3/4 md:w-2/5 mx-auto mb-6 sm:mb-8"
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const lastEmittedSearchTermRef = useRef(undefined);
  const lastEmittedFilteredDataRef = useRef(undefined);
  const onSearchResultsRef = useRef(onSearchResults);

  useEffect(() => {
    onSearchResultsRef.current = onSearchResults;
  }, [onSearchResults]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    let newFilteredData;

    if (!dataSource || !searchKeys || !searchKeys.length) {
      newFilteredData = dataSource || [];
    } else if (!searchTerm) {
      newFilteredData = dataSource;
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      newFilteredData = dataSource.filter((item) => {
        return searchKeys.some((key) => {
          // Use the helper function to get the value, supporting nested keys
          const value = getValueFromNestedKey(item, key);

          if (value === null || value === undefined) {
            return false;
          }

          let valueAsString;
          if (typeof value === 'string') {
            valueAsString = value.toLowerCase();
          } else if (typeof value === 'number') {
            valueAsString = String(value).toLowerCase();
          } else {
            // For other types, or if you only want to search strings and numbers
            return false;
          }

          return valueAsString.includes(lowerCaseSearchTerm);
        });
      });
    }

    const previousEmittedSearchTerm = lastEmittedSearchTermRef.current;
    const previousEmittedFilteredData = lastEmittedFilteredDataRef.current;

    const searchTermChanged = searchTerm !== previousEmittedSearchTerm;
    const filteredDataChanged = !areArraysShallowlyEqual(newFilteredData, previousEmittedFilteredData);

    if (searchTermChanged || filteredDataChanged) {
      onSearchResultsRef.current(newFilteredData, searchTerm);
      lastEmittedSearchTermRef.current = searchTerm;
      lastEmittedFilteredDataRef.current = newFilteredData;
    }
  }, [searchTerm, dataSource, searchKeys]);

  return (
    <div className={wrapperClassName}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full py-3 text-sm border-0 border-b border-slate-600 focus:border-indigo-500 focus:ring-0
         bg-transparent text-slate-100 placeholder-slate-400 outline-none transition-colors"
        aria-label={ariaLabel}
      />
    </div>
  );
};

export default SearchBar;