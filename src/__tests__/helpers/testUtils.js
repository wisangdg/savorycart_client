import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

// Create a custom render function that includes Redux provider and Router
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        auth: (state = { token: null, user: null }, action) => state,
        tags: (state = { activeTags: [] }, action) => state,
        ...preloadedState
      },
      preloadedState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }
  
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock axios response
export const mockAxiosResponse = (data, status = 200) => {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config: {}
  };
};

// Mock axios error
export const mockAxiosError = (status = 500, message = 'Server Error') => {
  const error = new Error(message);
  error.response = {
    status,
    data: { message }
  };
  return error;
};

// Wait for a specified time
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
