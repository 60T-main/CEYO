import { setProductList, setRecentProductList, setDateOrderedProducts, setCategoriesList, handleCartUpdate , setCart, setSearchTerm} from '../hooks/ProductStates.js';

import { setErrorMessage } from '../hooks/UserStates.js';
import { setErrorMessage } from '../hooks/Error.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// FETCH OPTIONS //
export const GET_OPTIONS = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

export const POST_OPTIONS = {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};
export const PUT_OPTIONS = {
  method: 'PUT',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

export const DELETE_OPTIONS = {
  method: 'DELETE',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};


// FETCH FUNCTIONS //

// fetch all products
export const fetchProducts = async (filters = {}) => {
    setIsLoading(true);

    const params = new URLSearchParams(filters).toString();
    const endpoint = `/product/?${params}`;

    try {
      const response = await fetch(API_BASE_URL + endpoint, { ...GET_OPTIONS });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setProductList([]);
        return;
      }

      if (filters.order_by === 'last_modified') {
        setDateOrderedProducts(data);

        console.log('date_descending triggered: ', filters.order_by);
      } else {
        setProductList(data);

        console.log('productList updated:', filters);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Error fetching products. Please try again later...');
    } finally {
      setIsLoading(false);
    }
};
  
// fetch recent products
export const fetchRecentProducts = async () => {
    const endpoint = `/product/recents`;
    setIsLoading(true);

    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch recent products');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch recent products');
        setRecentProductList([]);
        return;
      }

      setRecentProductList(data);
    } catch (error) {
      console.error('Error fetching recent products:', error);
      setErrorMessage('Error fetching recent products. Please try again later...');
    } finally {
      // Ensure loading state is always cleared, even when early returns occur above
      setIsLoading(false);
    }
};

// fetch categories
export const fetchCategories = async () => {
    const endpoint = `/product/categories/`;

    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch categories');
        setCategoriesList([]);
        return;
      }

      setCategoriesList(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Error fetching categories. Please try again later...');
    }
};
  

// fetch cart
export const fetchCart = async () => {
    const endpoint = `/product/cart/`;

    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch cart');
        setCart([]);
        return;
      }

      setCart(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Error fetching categories. Please try again later...');
    }
};
  
// fetch remove cart
export const handleRemoveFromCart = async (id, e) => {
    e.preventDefault();

    const endpoint = '/product/cart/delete/';

    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...DELETE_OPTIONS,
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      handleCartUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
      setErrorMessage('Error adding comment. Please try again later...');
    }
};
  

// USER FETCH FUNCTIONS //
export const checkIfLogedIn = async () => {
    const endpoint = '/customer/status/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to get login status');
      }
      setLoggedIn(!!data.loggedIn);
      return !!data.loggedIn;
    } catch (error) {
      console.error('Error getting login status:', error);
      setErrorMessage('Error getting login status. Please try again later...');
      setLoggedIn(false);
      return false;
    }
  };

export const getUserInfo = async () => {
    const userEndpoint = '/customer/user/';
    const isLogged = await checkIfLogedIn();
    if (!isLogged) {
      setUserInfo(null);
      return null;
    }
    try {
      const response = await fetch(API_BASE_URL + userEndpoint, GET_OPTIONS);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }
      setUserInfo(data);
      return data;
    } catch (error) {
      console.error('Error getting user info:', error);
      setErrorMessage('Error getting user info. Please try again later...');
      setUserInfo(null);
      return null;
    }
  };
