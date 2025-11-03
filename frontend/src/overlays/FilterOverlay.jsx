import React from 'react';
import { useEffect, useState } from 'react';

import { useProductContext } from '@/hooks/ProductStates';
import { usePageContext } from '@/hooks/PageStates';

const FilterOverlay = ({ onFilter }) => {
  const {
    categoriesList,
    debouncedSearchTerm,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    chosenCategory,
    setChosenCategory,
    chosenSubCategory,
    setChosenSubCategory,
  } = useProductContext();

  const parentCattegories = ['ქალი', 'კაცი', 'ბავშვი'];

  async function handleFilter(event) {
    event.preventDefault();
    const category = chosenSubCategory ? chosenSubCategory : chosenCategory;
    onFilter({
      search: debouncedSearchTerm,
      category: category,
      min_price: minPrice,
      max_price: maxPrice,
    });
  }

  async function onFilterClear(event) {
    event.preventDefault();
    setMinPrice('');
    setMaxPrice('');
    setChosenCategory('');
    setChosenSubCategory('');
    onFilter({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
    });
  }

  // Remove useEffect that resets subcategory on every mount

  return (
    <div className="filter">
      <form className={'filter-form'} onSubmit={handleFilter}>
        <div className="filter-price-parent">
          <h4 className="inline-font">ფასი:</h4>
          <div className="filter-price">
            <div className="input-div">
              <input
                type="number"
                placeholder="მინიმუნი"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              ₾
            </div>
            <div className="input-div">
              <input
                type="number"
                placeholder="მაქსიმუმი"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              ₾
            </div>
          </div>
        </div>
        <fieldset
          id="category-radio"
          name="category-radio"
          onChange={(e) => {
            setChosenSubCategory('');
            setChosenCategory(e.target.value);
          }}
        >
          <h4 className="inline-font">კატეგორია:</h4>

          {categoriesList.map(
            (element) =>
              !element.parent && (
                <div className="category-radio-div" key={element.id}>
                  <input
                    type="radio"
                    id={element.name}
                    name="category-radio"
                    value={String(element.id)}
                    checked={String(chosenCategory) === String(element.id)}
                    onChange={(e) => setChosenCategory(e.target.value)}
                  />
                  <label htmlFor={element.name}>{element.name}</label>
                </div>
              )
          )}
        </fieldset>
        <fieldset
          id="subcategory-radio"
          name="subcategory-radio"
          onChange={(e) => setChosenSubCategory(e.target.value)}
        >
          <h4 className="inline-font">ქვეკატეგორია:</h4>

          {chosenCategory ? (
            categoriesList.map(
              (element) =>
                element.parent &&
                String(element.parent) === String(chosenCategory) && (
                  <div className="category-radio-div" key={element.id}>
                    <input
                      type="radio"
                      id={element.id}
                      name="subcategory-radio"
                      value={String(element.id)}
                      checked={String(chosenSubCategory) === String(element.id)}
                      onChange={(e) => setChosenSubCategory(e.target.value)}
                    />
                    <label htmlFor={element.id}>{element.name}</label>
                  </div>
                )
            )
          ) : (
            <p className="text-sm text-[var(--color-secondary-font)]">გთხოვთ აირჩიეთ კატეგორია</p>
          )}
        </fieldset>

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
