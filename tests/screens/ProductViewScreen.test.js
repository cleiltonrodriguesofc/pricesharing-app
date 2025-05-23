// mock implementation for ProductViewScreen test
import React from 'react';
import { render } from '@testing-library/react-native';
import ProductViewScreen from '../../screens/ProductViewScreen';
import { doc, getDoc } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';

// mock firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// mock expo router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

// mock firebase config
jest.mock('../../firebaseConfig', () => ({
  db: {},
}));

describe('ProductViewScreen', () => {
  beforeEach(() => {
    // clear all mocks
    jest.clearAllMocks();
    
    // mock params
    useLocalSearchParams.mockReturnValue({ productId: 'test-product-id' });
    
    // mock successful product fetch
    const mockDocSnap = {
      exists: jest.fn().mockReturnValue(true),
      id: 'test-product-id',
      data: jest.fn().mockReturnValue({
        name: 'Test Product',
        price: 10.99,
        location: 'Test Store',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: { seconds: 1621234567 }
      })
    };
    
    doc.mockReturnValue('doc-ref');
    getDoc.mockResolvedValue(mockDocSnap);
  });

  it('renders without crashing', () => {
    render(<ProductViewScreen />);
    // if no error is thrown, the test passes
    expect(true).toBe(true);
  });
});
