import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export default function Signup() {
  const navigation = useNavigation();
  const router = useRouter();

  navigation.setOptions({
    tabBarStyle: {
      display: 'none'
    }
  });

  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  const isFormValid = () => {
    return (
      formData.username.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== ''
    );
  };

  const handleSubmit = async () => {
    try {
      if (!isFormValid()) {
        alert('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        window.location.href = '/';
      }
      await AsyncStorage.setItem('username', formData.username);
      router.push('/');
    } catch (error) {
      alert('Registration failed: ' + (error as Error).message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={styles.backButton}
          onPress={() => router.push('/auth/Login')}
        >
          ← Back
        </Text>
      </View>
      <Text style={styles.title}>Sign up to Start Tracking Today!</Text>
      <TextInput
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({...formData, username: text})}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({...formData, password: text})}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
        style={styles.input}
        secureTextEntry
      />
      <Button 
        title="Sign Up" 
        onPress={handleSubmit}
        disabled={!isFormValid()} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 50,
    padding: 10
  },
  input: {
    width: '80%',
    maxWidth: 300,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center'
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    color: 'white',
    fontSize: 18,
    padding: 10,
  },
});

