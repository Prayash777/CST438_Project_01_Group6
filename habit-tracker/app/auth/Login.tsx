/*

TODO: Eventually, I want this app to allow users to view the default home page without loggin in. When the user tries to create a habit, they will be redirected to the login page.
I despise websites that force users to login before they can view the home page. Probably steers >80% of users away. -ethan
*/

import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";


import database from "../db/database";
import { insertUser, getAllUsers } from '../db/database';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginContentProps {
  formData: LoginFormData;
  setFormData: React.Dispatch<React.SetStateAction<LoginFormData>>;
  database: SQLiteDatabase;
  router: any; // or import Router type from expo-router if available
}

export default function Login() {
  const navigation = useNavigation();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: {
        display: 'none'
      }
    });
  }, [navigation]);

  return (
    <SQLiteProvider databaseName="habit-tracker.db">
      <LoginContentWrapper formData={formData} setFormData={setFormData} router={router} />
    </SQLiteProvider>
  );
}

// Create a wrapper component to use the SQLite context
function LoginContentWrapper({ formData, setFormData, router }: Omit<LoginContentProps, 'database'>) {
  // const database = useSQLiteContext();
  return <LoginContent formData={formData} setFormData={setFormData} database={database} router={router} />;
}

function LoginContent({ formData, setFormData, database, router }: LoginContentProps) {
  const handleSubmit = async () => {
    //NEW CODE
    try {

      // testing to see users in database
      getAllUsers();

      const result = await database.getAllAsync<{ id: number; email: string; password: string }>(
        "SELECT * FROM users WHERE email = ?", [formData.email]
      );
      if (result.length == 0) {
        alert("User not found");
        return;
      }
      const user = result[0];
      if (user.password == formData.password) {
        await AsyncStorage.setItem('@user_email', formData.email);
        await AsyncStorage.setItem('@user_id', user.id.toString());
        console.log('Email stored successfully:', formData.email);
        console.log('Email stored successfully:', user.id.toString());
        router.push('/');
      } else {
        alert("Incorrect password");
        setFormData({ email: '', password: '' });
      }

      // testing to see users in database
      getAllUsers();

    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed: Email or password is not correct');
      setFormData({ email: '', password: '' });
    }
  };

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

  return (
    <View style={[styles.loginContainer]}>
      <Text style={[styles.appTitle]}>Habit Tracker</Text>
      <Text style={[styles.title]}>Welcome Back!</Text>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <TextInput
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Email"
            style={[styles.input]}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Password"
            style={[styles.input]}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!formData.email || !formData.password}
            style={[
              styles.loginButton,
              (!formData.email || !formData.password) && styles.loginButtonDisabled
            ]}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        </View>
      </View>
      <View style={styles.signupContainer}>
        <Text style={[styles.signupText]}>Don't have an account?</Text>
        <Button
          title="Sign Up"
          onPress={() => router.push('/auth/Signup')}
        />
      </View>
    </View>
  );
};


// https://coolors.co/403f4c-2c2b3c-1b2432-121420-b76d68
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#121420',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: '#B76D68',
    fontFamily: 'Lato',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    color: '#403F4C',
    fontFamily: 'Lato',
    fontSize: 28,
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
    color: 'white',
    backgroundColor: '#2C2B3C',
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
  loginButton: {
    backgroundColor: '#B76D68',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#B76D68',
    opacity: 0.5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});