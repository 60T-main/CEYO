export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const csrftoken = getCookie('csrftoken');

// FETCH OPTIONS //
export const GET_OPTIONS = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

export const POST_OPTIONS = {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
};
export const PUT_OPTIONS = {
  method: 'PUT',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
};

export const DELETE_OPTIONS = {
  method: 'DELETE',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
};

import { useProductContext } from '../hooks/ProductStates.jsx';
import { usePageContext } from '../hooks/PageStates.jsx';
import { useUserContext } from '../hooks/UserStates.jsx';
import { useErrorContext } from '../hooks/ErrorStates.jsx';

export function useApi() {
  const {
    setProductList,
    setProductDetail,
    setDateOrderedProducts,
    setRecentProductList,
    setCategoriesList,
    setCart,
  } = useProductContext();
  const { setErrorMessage } = useErrorContext();
  const { setUserInfo, setLoggedIn } = useUserContext();
  const { setIsLoading, setAddToCartLoading } = usePageContext();

  // Fetch all products
  const fetchProducts = async (filters = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const endpoint = `/product/?${params}`;
      const response = await fetch(API_BASE_URL + endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      if (data.Response === 'False') {
        setProductList([]);
        return;
      }

      const filtered = data.filter(
        (product) => product.product_variants.length > 0 && product.images.length > 0
      );

      if (filters.order_by === 'created_at') {
        setDateOrderedProducts(filtered);
      } else {
        setProductList(filtered);
      }
    } catch (error) {
      setErrorMessage('Error fetching products. Please try again later...');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single product
  const fetchProductDetail = async (id) => {
    setIsLoading(true);

    const endpoint = `/product/${id}/`;

    try {
      const response = await fetch(API_BASE_URL + endpoint, GET_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch product details');
        setProductDetail([]);
        return;
      }

      setProductDetail(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Error fetching products. Please try again later...');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Recent Products
  const fetchRecentProducts = async () => {
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
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const endpoint = `/product/categories/`;
      const response = await fetch(API_BASE_URL + endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();

      if (data.Response === 'False') {
        setCategoriesList([]);
        setErrorMessage(data.Error || 'Failed to fetch categories');
        return;
      }

      setCategoriesList(data);
    } catch (error) {
      setErrorMessage('Error fetching categories. Please try again later...');
    }
  };

  //  Fetch Cart
  const fetchCart = async (variant) => {
    variant !== 'addToCart' ? setIsLoading(true) : setAddToCartLoading(true);
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
      console.error('Error fetching cart:', error);
      setErrorMessage('Error fetching cart. Please try again later...');
    } finally {
      setIsLoading(false);
      setAddToCartLoading(false);
    }
  };

  // fetch add/remove cart
  const handleRemoveFromCart = async (id, e) => {
    setIsLoading(true);
    e.preventDefault();
    const endpoint = '/product/cart/delete/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...DELETE_OPTIONS,
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to remove cart item');
      }
      handleCartUpdate();
    } catch (error) {
      console.error('Error removing cart item:', error);
      setErrorMessage('Error removing cart item. Please try again later...');
    }
  };

  const handleAddToCart = async (id, e) => {
    setIsLoading(true);
    e.preventDefault();
    const endpoint = '/product/cart/add/';
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...POST_OPTIONS,
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to add cart item');
      }
      handleCartUpdate();
    } catch (error) {
      console.error('Error adding cart item:', error);
      setErrorMessage('Error adding cart item. Please try again later...');
    }
  };

  const handleCartUpdate = async (variant) => {
    await fetchCart(variant);
  };

  // USER FETCH FUNCTIONS //
  const checkIfLogedIn = async () => {
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

  const getUserInfo = async () => {
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

  return {
    API_BASE_URL,
    GET_OPTIONS,
    POST_OPTIONS,
    PUT_OPTIONS,
    fetchProducts,
    fetchProductDetail,
    fetchRecentProducts,
    fetchCategories,
    fetchCart,
    handleRemoveFromCart,
    handleAddToCart,
    getUserInfo,
    checkIfLogedIn,
    handleCartUpdate,
  };
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
