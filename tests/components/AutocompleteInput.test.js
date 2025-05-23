import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AutocompleteInput from '../../components/AutocompleteInput';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// mock the firestore module
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  startAt: jest.fn(),
  endAt: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
}));

// mock the firebase config
jest.mock('../../firebaseConfig', () => ({
  db: {},
}));

describe('AutocompleteInput', () => {
  const mockOnSelect = jest.fn();
  
  beforeEach(() => {
    // clear all mocks before each test
    jest.clearAllMocks();
    
    // mock successful suggestions fetch
    const mockQuerySnapshot = {
      forEach: jest.fn(callback => {
        // mock data for suggestions
        const suggestions = [
          {
            id: 'product1',
            data: () => ({
              name: 'Coca Cola 2L'
            })
          },
          {
            id: 'product2',
            data: () => ({
              name: 'Coca Cola Zero'
            })
          }
        ];
        
        suggestions.forEach(callback);
      })
    };
    
    collection.mockReturnValue('products-collection');
    query.mockReturnValue('products-query');
    getDocs.mockResolvedValue(mockQuerySnapshot);
  });

  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <AutocompleteInput placeholder="Search product" onSelect={mockOnSelect} />
    );
    
    // check if input with placeholder is rendered
    expect(getByPlaceholderText('Search product')).toBeTruthy();
  });

  it('fetches suggestions when typing', async () => {
    const { getByPlaceholderText } = render(
      <AutocompleteInput placeholder="Search product" onSelect={mockOnSelect} />
    );
    
    // get input and type in it
    const input = getByPlaceholderText('Search product');
    fireEvent.changeText(input, 'Coca');
    
    // verify firestore was queried
    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(db, 'products');
      expect(getDocs).toHaveBeenCalled();
    });
  });

  it('displays suggestions and allows selection', async () => {
    const { getByPlaceholderText, findByText } = render(
      <AutocompleteInput placeholder="Search product" onSelect={mockOnSelect} />
    );
    
    // get input and type in it
    const input = getByPlaceholderText('Search product');
    fireEvent.changeText(input, 'Coca');
    
    // wait for suggestions to appear and select one
    const suggestion = await findByText('Coca Cola 2L');
    fireEvent.press(suggestion);
    
    // verify onSelect was called with correct data
    expect(mockOnSelect).toHaveBeenCalledWith({
      id: 'product1',
      name: 'Coca Cola 2L'
    });
    
    // verify input value was updated
    expect(input.props.value).toBe('Coca Cola 2L');
  });

  it('initializes with provided value', () => {
    const { getByPlaceholderText } = render(
      <AutocompleteInput 
        placeholder="Search product" 
        onSelect={mockOnSelect}
        initialValue="Initial Product"
      />
    );
    
    // check if input has initial value
    const input = getByPlaceholderText('Search product');
    expect(input.props.value).toBe('Initial Product');
  });
});
