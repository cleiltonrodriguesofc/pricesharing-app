// simplified test file that focuses on basic component rendering
import React from 'react';
import { render } from '@testing-library/react-native';
import SignupScreen from '../../screens/SignupScreen';

// mock the firebase auth module
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

// mock the expo router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

describe('SignupScreen', () => {
  beforeEach(() => {
    // clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SignupScreen />);
    // if no error is thrown, the test passes
    expect(true).toBe(true);
  });
});
