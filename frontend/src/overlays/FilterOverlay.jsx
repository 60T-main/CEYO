import React from 'react';
import { useEffect, useState } from 'react';

import { useProductContext } from '../hooks/ProductStates';

const FilterOverlay = ({ onFilter }) => {
  const { categoriesList, debouncedSearchTerm } = useProductContext();

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [chosenCategory, setChosenCategory] = useState('');

  const parentCattegories = ['ქალი', 'კაცი', 'ბავშვი'];

  async function handleFilter(event) {
    event.preventDefault();
    onFilter({
      search: debouncedSearchTerm,
      category: chosenCategory,
      min_price: minPrice,
      max_price: maxPrice,
    });
  }

  async function onFilterClear(event) {
    event.preventDefault();
    setMinPrice('');
    setMaxPrice('');
    setChosenCategory('');
    onFilter({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
    });
  }

  return (
    <div className="filter">
      <form className={'filter-form'} onSubmit={handleFilter}>
        <fieldset
          id="category-radio"
          name="category-radio"
          onChange={(e) => setChosenCategory(e.target.value)}
        >
          <h3>კატეგორია:</h3>

          {categoriesList.map(
            (element) =>
              !element.parent && (
                <div key={element.category_id}>
                  <input
                    type="radio"
                    id={element.name}
                    name="category-radio"
                    value={element.name}
                    checked={chosenCategory === element.name}
                    onChange={(e) => setChosenCategory(e.target.value)}
                  />
                  <label htmlFor={element.name}>{element.name}</label>
                </div>
              )
          )}
        </fieldset>
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
        <div className="filter-btns-parent">
          <button
            className="clear-btn"
            onClick={(e) => {
              onFilterClear(e);
            }}
          >
            გასუფთავება
          </button>
          <button className="submit-btn" type="submit">
            გაფილტვრა
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterOverlay;
