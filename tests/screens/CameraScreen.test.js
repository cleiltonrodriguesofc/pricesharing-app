// simplified test file that focuses on basic component rendering
import React from 'react';
import { render } from '@testing-library/react-native';
import CameraScreen from '../../screens/CameraScreen';
import { Camera } from 'expo-camera';

// mock the expo camera module
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    Constants: {
      Type: {
        back: 'back',
      },
    },
  },
}));

// mock image picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'images',
  },
}));

// mock the expo router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// mock the camera component itself to avoid rendering issues
jest.mock('expo-camera', () => {
  const React = require('react');
  const Camera = props => {
    return React.createElement('View', props, props.children);
  };
  Camera.Constants = {
    Type: {
      back: 'back',
    },
  };
  Camera.requestCameraPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
  return { Camera };
});

describe('CameraScreen', () => {
  beforeEach(() => {
    // clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CameraScreen />);
    // if no error is thrown, the test passes
    expect(true).toBe(true);
  });
});
