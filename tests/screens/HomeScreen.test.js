import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../screens/HomeScreen';
import { collection, query, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';
import { db } from '../../firebaseConfig';

// mock the firestore module
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
  where: jest.fn(),
}));

// mock the expo router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// mock the firebase config
jest.mock('../../firebaseConfig', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'test-user-id' }
  }
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    // clear all mocks before each test
    jest.clearAllMocks();
    
    // mock successful products fetch
    const mockQuerySnapshot = {
      forEach: jest.fn(callback => {
        // mock data for two products
        const products = [
          {
            id: 'product1',
            data: () => ({
              name: 'Test Product 1',
              price: 10.99,
              location: 'Test Store 1',
              imageUrl: 'https://example.com/image1.jpg',
              createdAt: { seconds: 1621234567 }
            })
          },
          {
            id: 'product2',
            data: () => ({
              name: 'Test Product 2',
              price: 20.99,
              location: 'Test Store 2',
              imageUrl: 'https://example.com/image2.jpg',
              createdAt: { seconds: 1621234568 }
            })
          }
        ];
        
        products.forEach(callback);
      })
    };
    
    collection.mockReturnValue('products-collection');
    query.mockReturnValue('products-query');
    getDocs.mockResolvedValue(mockQuerySnapshot);
  });

  it('renders correctly and fetches products', async () => {
    const { findByText } = render(<HomeScreen />);
    
    // verify firestore was queried
    expect(collection).toHaveBeenCalledWith(db, 'products');
    expect(getDocs).toHaveBeenCalled();
    
    // check if products are rendered
    const product1 = await findByText('Test Product 1');
    const product2 = await findByText('Test Product 2');
    
    expect(product1).toBeTruthy();
    expect(product2).toBeTruthy();
  });

  it('filters products based on search query', async () => {
    const { findByText, getByPlaceholderText } = render(<HomeScreen />);
    
    // wait for products to load
    await findByText('Test Product 1');
    
    // enter search query
    const searchInput = getByPlaceholderText('Search products...');
    fireEvent.changeText(searchInput, 'Product 2');
    
    // check if only matching product is shown
    const product2 = await findByText('Test Product 2');
    expect(product2).toBeTruthy();
    
    // product 1 should not be in the document anymore
    expect(() => findByText('Test Product 1')).rejects.toThrow();
  });

  it('navigates to camera screen when add button is pressed', async () => {
    const { findByText } = render(<HomeScreen />);
    
    // wait for products to load
    await findByText('Test Product 1');
    
    // find and press the add button (which has "+" text)
    const addButton = await findByText('+');
    fireEvent.press(addButton);
    
    // verify navigation
    expect(router.push).toHaveBeenCalledWith('/camera');
  });

  it('navigates to product details when a product is pressed', async () => {
    const { findByText } = render(<HomeScreen />);
    
    // wait for products to load and press on one
    const product1 = await findByText('Test Product 1');
    fireEvent.press(product1);
    
    // verify navigation with correct params
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/productview',
      params: { productId: 'product1' }
    });
  });
});
