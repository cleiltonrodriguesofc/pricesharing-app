import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { auth } from '../firebaseConfig';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestedNames, setSuggestedNames] = useState([]);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      setLoading(true);
      try {
        const photo = await cameraRef.takePictureAsync();
        setCapturedImage(photo.uri);
        await analyzeImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const pickImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (imageUri) => {
    setLoading(true); // Set loading to true when analysis starts
    try {
      // Replace with your actual Firebase Cloud Function endpoint URL
      const apiEndpoint = 'YOUR_CLOUD_FUNCTION_VISION_API_ENDPOINT';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUri: imageUri }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API request failed: ${response.status} - ${error}`);
      }

      const data = await response.json();

      // Assuming the API returns an object like { suggestions: ["name1", "name2"] }
      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestedNames(data.suggestions);
      } else {
        setSuggestedNames(['Could not identify product.']); // Provide a default suggestion
      }

    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image: ' + error.message);
      setSuggestedNames(['Analysis failed.']); // Indicate failure
    } finally {
      setLoading(false); // Set loading to false when analysis finishes
    }
  };

  const selectName = (name) => {
    // navigate to the image selection screen with the selected name
    router.push({
      pathname: '/imageselection',
      params: { productName: name, imageUri: capturedImage }
    });
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setSuggestedNames([]);
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
        <ThemedText>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No access to camera</ThemedText>
        <TouchableOpacity 
          style={styles.button}
          onPress={pickImage}
        >
          <ThemedText style={styles.buttonText}>Select from Gallery</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {!capturedImage ? (
        <>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={ref => setCameraRef(ref)}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
          </Camera>
          <TouchableOpacity 
            style={styles.galleryButton}
            onPress={pickImage}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>Gallery</ThemedText>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4285F4" />
              <ThemedText>Analyzing image...</ThemedText>
            </View>
          ) : (
            <>
              {suggestedNames.length > 0 ? (
                <View style={styles.suggestionsContainer}>
                  <ThemedText style={styles.suggestionsTitle}>
                    Select the correct product name:
                  </ThemedText>
                  <FlatList
                    data={suggestedNames}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.suggestionItem}
                        onPress={() => selectName(item)}
                      >
                        <ThemedText>{item}</ThemedText>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : null}
              
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetCamera}
              >
                <ThemedText style={styles.buttonText}>Take Another Photo</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  galleryButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  suggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    maxHeight: '50%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resetButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
});
