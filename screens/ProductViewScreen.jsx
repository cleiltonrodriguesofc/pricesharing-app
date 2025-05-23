import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Image } from 'expo-image';

export default function ProductViewScreen() {
  const params = useLocalSearchParams();
  const { productId } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProductDetails();
  }, []);
  
  const fetchProductDetails = async () => {
    if (!productId) {
      Alert.alert('Error', 'Product ID is missing');
      router.back();
      return;
    }
    
    setLoading(true);
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProduct({
          id: docSnap.id,
          ...docSnap.data()
        });
      } else {
        Alert.alert('Error', 'Product not found');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch product details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <ThemedText>Loading product details...</ThemedText>
      </ThemedView>
    );
  }
  
  if (!product) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>Product not found</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: product.imageUrl }} 
          style={styles.productImage}
          contentFit="cover"
        />
        
        <View style={styles.productDetails}>
          <ThemedText style={styles.productName}>{product.name}</ThemedText>
          
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceLabel}>Price:</ThemedText>
            <ThemedText style={styles.priceValue}>R$ {product.price.toFixed(2)}</ThemedText>
          </View>
          
          <View style={styles.locationContainer}>
            <ThemedText style={styles.locationLabel}>Location:</ThemedText>
            <ThemedText style={styles.locationValue}>{product.location}</ThemedText>
          </View>
          
          {product.createdAt && (
            <ThemedText style={styles.dateText}>
              Added on {new Date(product.createdAt.seconds * 1000).toLocaleDateString()}
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  productDetails: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  priceValue: {
    fontSize: 18,
    color: '#4285F4',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  locationValue: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});
