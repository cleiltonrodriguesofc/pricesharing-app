import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { router } from 'expo-router';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { Image } from 'expo-image';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.replace('/login');
    }
  }, []);
  
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user.photoURL ? (
            <Image 
              source={{ uri: user.photoURL }} 
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <ThemedText style={styles.avatarText}>
                {user.email ? user.email[0].toUpperCase() : '?'}
              </ThemedText>
            </View>
          )}
        </View>
        
        <ThemedText style={styles.userName}>
          {user.displayName || 'User'}
        </ThemedText>
        <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
      </View>
      
      <View style={styles.infoSection}>
        <ThemedText style={styles.sectionTitle}>About PriceSharing</ThemedText>
        <ThemedText style={styles.infoText}>
          PriceSharing helps you track and share product prices across different stores.
          Take photos of products, get AI-suggested names, and keep track of the best deals.
        </ThemedText>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
