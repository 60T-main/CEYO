import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './style.css';
import App from './App.jsx';

import { ProductProvider } from './hooks/ProductStates.jsx';
import { UserProvider } from './hooks/UserStates.jsx';
import { PageProvider } from './hooks/PageStates.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <ProductProvider>
      <PageProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </PageProvider>
    </ProductProvider>
  </Router>
);
