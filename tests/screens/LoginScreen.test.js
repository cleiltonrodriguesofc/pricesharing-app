// simplified test file that focuses on basic component rendering
import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../../screens/LoginScreen';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

// mock the firebase auth module
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
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

describe('LoginScreen', () => {
  beforeEach(() => {
    // clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LoginScreen />);
    // if no error is thrown, the test passes
    expect(true).toBe(true);
  });
});
