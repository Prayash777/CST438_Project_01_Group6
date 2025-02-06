/*

TODO: Eventually, I want this app to allow users to view the default home page without loggin in. When the user tries to create a habit, they will be redirected to the login page.
I despise websites that force users to login before they can view the home page. Probably steers >80% of users away. -ethan
*/

import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, GestureResponderEvent } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';

import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {

  const navigation = useNavigation();
  const router = useRouter();

  
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: {
        display: 'none'
      }
    });
  }, [navigation]);

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

  const handleSubmit = async () => {
    try {

      await AsyncStorage.setItem('user_email', formData.email);
      router.push('/');

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
      alert('Login failed');
    }
  };


  const { theme } = useTheme();

  //
  // database components ->

  // get the database from the stack
  const database = useSQLiteContext();

  // insert new user
  const handleInsertUserAccount = async () => {
    try {
      const { email, password } = formData;
      const response = await database.runAsync(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, password]
      );
      console.log("Item saved successfully:", response?.changes!);
      // router.back();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // get data, and just log it to the console
  const loadData = async () => {
    const result = await database.getAllAsync<{
      id: number;
      email: string;
      password: string;
    }>("SELECT * FROM users");
    // setFormData(result);
    if (result.length > 0) {
      setFormData({
        email: result[0].email,
        password: result[0].password
      });
    }
    console.log(result);
  };

  // <- database components 
  //


  return (
    <View style={[styles.loginContainer, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.appTitle, { color: theme.colors.text }]}>Habit Tracker</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back!</Text>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <TextInput
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Email"
            style={[styles.input, { backgroundColor: theme.colors.card }]}
            placeholderTextColor={theme.colors.text}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Password" 
            style={[styles.input, { backgroundColor: theme.colors.card }]}
            placeholderTextColor={theme.colors.text}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Login"
            onPress={handleSubmit}
            color={theme.colors.primary}
            disabled={!formData.email || !formData.password}

        <View>
          <Button
            title="Sign Up"
            onPress={handleInsertUserAccount}
          // onPress={() => router.push('/auth/Signup')}

          />
        </View>
        <Button title="View User Accounts" onPress={loadData} />
      </View>
      <View style={styles.signupContainer}>
        <Text style={[styles.signupText, { color: theme.colors.text }]}>Don't have an account?</Text>
        <Button 
          title="Sign Up"
          onPress={() => router.push('/auth/Signup')}
          color={theme.colors.primary}
        />
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
  appTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 50,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
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
  buttonContainer: {
    width: '80%',
    maxWidth: 300,
    marginTop: 10,
  },
  signupContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',

    alignItems: 'center',
  },
  signupText: {
    color: 'white',
    marginBottom: 10,
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

export default Login; 

    marginBottom: 20,
    alignItems: 'center'
  }
});

