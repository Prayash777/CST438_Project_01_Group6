/*

TODO: Eventually, I want this app to allow users to view the default home page without loggin in. When the user tries to create a habit, they will be redirected to the login page.
I despise websites that force users to login before they can view the home page. Probably steers >80% of users away. -ethan
*/

import { useState, FormEvent } from 'react';
import cssStyles from './Login.module.css';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {

  const navigation = useNavigation();
  const router = useRouter();
  navigation.setOptions({
    headerShown: false,
    tabBarStyle: {
      display: 'none'
    }
  });
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // TODO: API!
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Login to Track Today!</Text>
      <View style={styles.form}>
        <View>
          <TextInput
            value={formData.email}
            onChangeText={(e) => setFormData({ ...formData, email: e })}
            placeholder="Email"
            style={styles.input}
          />
        </View>
        <View>
          <TextInput
            value={formData.password}
            onChangeText={(e) => setFormData({ ...formData, password: e })}
            placeholder="Password"
            style={styles.input}
          />
        </View>
        <View>
          <Button 
            title="Sign Up"
            onPress={() => router.push('/auth/Signup')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
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
  form: {
    width: '100%',
    alignItems: 'center',
  },
  formGroup: {
    width: '80%',
    maxWidth: 300,
    marginBottom: 15,
  },
  input: {
    width: '100%',
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
  }
});

export default Login; 