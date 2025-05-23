import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, startAt, endAt, getDocs, limit } from 'firebase/firestore';

export default function AutocompleteInput({ 
  placeholder, 
  onSelect, 
  initialValue = '',
  style = {}
}) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);
  
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const searchQueryLower = searchQuery.toLowerCase();
      const searchQueryUpper = searchQuery.toLowerCase() + '\uf8ff';
      
      const q = query(
        collection(db, 'products'),
        orderBy('name'),
        startAt(searchQueryLower),
        endAt(searchQueryUpper),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      
      const suggestionsData = [];
      querySnapshot.forEach((doc) => {
        // Avoid duplicates
        if (!suggestionsData.some(item => item.name === doc.data().name)) {
          suggestionsData.push({
            id: doc.id,
            name: doc.data().name
          });
        }
      });
      
      setSuggestions(suggestionsData);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelect = (item) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(item);
    }
  };
  
  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.suggestionItem}
      onPress={() => handleSelect(item)}
    >
      <ThemedText>{item.name}</ThemedText>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
      />
      
      {loading && (
        <ActivityIndicator 
          style={styles.loadingIndicator} 
          size="small" 
          color="#4285F4" 
        />
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={renderSuggestionItem}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});
