import React from 'react';
import { useEffect, useState } from 'react';

const Filter = ({ categoriesList, onFilter, debouncedSearchTerm }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [chosenCategory, setChosenCategory] = useState('');

  async function handleFilter(event) {
    event.preventDefault();
    onFilter({
      search: debouncedSearchTerm,
      category: chosenCategory,
      min_price: minPrice,
      max_price: maxPrice,
    });
  }

  return (
    <div className="filter">
      <form onSubmit={handleFilter}>
        <select
          id="category-dropdown"
          name="category-dropdown"
          onChange={(e) => setChosenCategory(e.target.value)}
        >
          <option value="">choose category</option>
          {categoriesList.map((element) => (
            <option key={element.category_id} value={element.name}>
              {element.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button type="submit">Filter</button>
      </form>
    </div>
  );
};

export default Filter;
