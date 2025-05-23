import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { router, useLocalSearchParams } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { Image } from 'expo-image';

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams();
  const { productName, imageUrl } = params;
  
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  
  const saveProduct = async () => {
    if (!price || !location) {
      Alert.alert('Missing Information', 'Please enter both price and location');
      return;
    }
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Authentication Error', 'You must be logged in to save products');
        router.replace('/login');
        return;
      }
      
      // add product to firestore
      await addDoc(collection(db, 'products'), {
        name: productName,
        imageUrl: imageUrl,
        price: parseFloat(price),
        location: location,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      
      Alert.alert(
        'Success', 
        'Product saved successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/(tabs)') 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title">Product Details</ThemedText>
        </View>
        
        <View style={styles.productInfo}>
          <ThemedText style={styles.productName}>{productName}</ThemedText>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.productImage}
            contentFit="cover"
          />
        </View>
        
        <View style={styles.formContainer}>
          <ThemedText style={styles.label}>Price (R$)</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
          
          <ThemedText style={styles.label}>Location/Store</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Store name or location"
            value={location}
            onChangeText={setLocation}
          />
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.back()}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={saveProduct}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.primaryButtonText}>Save Product</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
