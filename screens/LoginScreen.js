import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = () => {
    // lógica de login com email (a implementar)
    alert(`Login com email: ${email}`);
  };

  const handleGoogleLogin = () => {
    // lógica de login com google (a implementar)
    alert('Login com Google');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.subtitle}>SUPERMARKET{"\n"}PRICE-SHARING</Text>

      <Text style={styles.description}>
        Scan barcodes, compare prices, and{"\n"}
        discover the best deals from local{"\n"}
        supermarkets.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}>
        <Text style={styles.emailButtonText}>Entrar com Email</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>ou</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleButtonText}>Entrar com Google</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By continuing, you agree to the Terms of{"\n"}
        Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B4A99',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  description: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#154C9A',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 15,
  },
  emailButton: {
    backgroundColor: '#004080',
    borderRadius: 6,
    paddingVertical: 14,
    marginBottom: 15,
  },
  emailButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  orText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 15,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 6,
    paddingVertical: 14,
    marginBottom: 30,
  },
  googleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  termsText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});
