import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      // TODO: Implement actual registration logic
      await AsyncStorage.setItem('username', formData.username);
      router.push('/');
    } catch (error) {
      alert('Registration failed: ' + (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
};

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
});

export default Signup;