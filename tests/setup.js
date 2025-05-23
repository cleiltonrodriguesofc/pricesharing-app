// setup file for jest tests
import { jest } from '@jest/globals';

// mock expo modules
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

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'images',
  },
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn().mockReturnValue({}),
}));

// mock firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  startAt: jest.fn(),
  endAt: jest.fn(),
  limit: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock('../firebaseConfig', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

// mock react-native components
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// global setup
global.console = {
  ...console,
  // uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(),
};
