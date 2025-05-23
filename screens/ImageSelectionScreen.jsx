import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';

export default function ImageSelectionScreen() {
  const params = useLocalSearchParams();
  const { productName, imageUri } = params;
  
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    searchImages();
  }, []);
  
  const searchImages = async () => {
    setLoading(true);
    try {
      // Replace with your actual Firebase Cloud Function endpoint URL for image search
      const apiEndpoint = 'YOUR_CLOUD_FUNCTION_IMAGE_SEARCH_API_ENDPOINT';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName: productName }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Image search API failed: ${response.status} - ${error}`);
      }

      const data = await response.json();

      // Assuming the API returns an object like { imageUrls: ["url1", "url2", "url3"] }
      if (data && data.imageUrls && Array.isArray(data.imageUrls)) {
        // Limit to a maximum of 3 images as per MVP
        setImages(data.imageUrls.slice(0, 3));
      } else {
        setImages([]); // No images found
        Alert.alert('No Images Found', 'Could not find relevant images for this product.');
      }

    } catch (error) {
      console.error('Error searching for images:', error);
      Alert.alert('Error', 'Failed to search for images: ' + error.message);
      setImages([]); // Clear images on error
    } finally {
      setLoading(false);
    }
  };
  
  const selectImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };
  
  const continueToProductDetails = () => {
    if (selectedImage) {
      router.push({
        pathname: '/productdetails',
        params: { 
          productName,
          imageUrl: selectedImage 
        }
      });
    } else {
      Alert.alert('Selection Required', 'Please select an image for the product');
    }
  };
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Select Product Image</ThemedText>
        <ThemedText>{productName}</ThemedText>
      </View>
      
      <View style={styles.capturedImageContainer}>
        <ThemedText style={styles.sectionTitle}>Your Photo:</ThemedText>
        <Image source={{ uri: imageUri }} style={styles.capturedImage} />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
          <ThemedText>Searching for product images...</ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.imagesContainer}>
            <ThemedText style={styles.sectionTitle}>Select an image for this product:</ThemedText>
            <FlatList
              data={images}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.imageItem,
                    selectedImage === item && styles.selectedImageItem
                  ]}
                  onPress={() => selectImage(item)}
                >
                  <Image 
                    source={{ uri: item }} 
                    style={styles.image}
                    onError={() => console.log('Image failed to load')}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.buttonText}>Back</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={continueToProductDetails}
            >
              <ThemedText style={styles.primaryButtonText}>Continue</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  capturedImageContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesContainer: {
    flex: 1,
  },
  imageItem: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImageItem: {
    borderColor: '#4285F4',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
