import { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router, useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";

import { Button } from '../../components/ui/Button';

import database from "../db/database";
import { insertUser, getAllUsers } from '../db/database';

// testing
// 

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

interface SignupContentProps {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  database: SQLiteDatabase;
  router: any; // or import Router type from expo-router if available
}

export default function Signup() {
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  return (
    <SQLiteProvider databaseName="habit-tracker.db">
      <SignupContentWrapper formData={formData} setFormData={setFormData} router={router} />
    </SQLiteProvider>
  );
}
function SignupContentWrapper({ formData, setFormData, router }: Omit<SignupContentProps, 'database'>) {
  // const database = useSQLiteContext();
  return <SignupContent formData={formData} setFormData={setFormData} database={database} router={router} />;
}

function SignupContent({ formData, setFormData, database, router }: SignupContentProps) {
  const isFormValid = () => {
    return (
      formData.username.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== ''
    );
  };


  // we should not create the database here -- this should be deleted -- 

  //   useEffect(() => {
  //     // Create the 'users' table if it doesn't already exist
  //     const createTable = async () => {
  //       try {
  //         await database.execAsync(
  //           `CREATE TABLE IF NOT EXISTS users (
  //             id INTEGER PRIMARY KEY AUTOINCREMENT,
  //             username TEXT NOT NULL,
  //             email TEXT NOT NULL,
  //             password TEXT NOT NULL
  //           )`
  //         );
  //         console.log("Users table created or already exists.");
  //       } catch (error) {
  //         console.error("Error creating table:", error);
  //       }
  //     };

  //     createTable();
  //   }, [database]);

  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Insert user data into SQLite database
      const { email, password, username } = formData;
      insertUser(username, email, password);


      // shouldnt call queries here
      // -- remove this --
      // await database.runAsync(
      //   `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      //   [username, email, password]
      // );
      // -- remove this --

      // testing to see users in database
      console.log("User inserted successfully!");
      getAllUsers();

      // shouldnt call queries here
      // -- remove this --
      // const users = await getAllUsers();
      // const users = await database.getAllAsync("SELECT * FROM users");
      // console.log("Users in DB:", users);
      // -- remove this --

      // Optionally, you can also store the username in AsyncStorage
      await AsyncStorage.setItem('username', formData.username);

      // Navigate to home screen or dashboard after successful signup
      router.push('/');
    } catch (error) {
      console.error('Error inserting user:', error);
      alert('Failed to create account');
    }
  };

  //     const response = await fetch('/api/auth/signup', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData)
  //     });

  //     if (response.ok) {
  //       window.location.href = '/';
  //     }
  //     await AsyncStorage.setItem('username', formData.username);
  //     router.push('/');
  //   } catch (error) {
  //     alert('Registration failed: ' + (error as Error).message);
  //   }
  //   const handleInsertUserAccount = async () => {
  //   try {
  //     const { email, password } = formData;
  //     await database.runAsync(
  //       `INSERT INTO users (email, password) VALUES (?, ?)`,
  //       [email, password]
  //     );
  //     router.push('/'); // Navigate after successful signup
  //   } catch (error) {
  //     console.error("Error creating account:", error);
  //     alert("Failed to create account");
  //   }


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
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        style={styles.input}
        secureTextEntry
      />
      <Button
        onPress={handleSubmit}
        disabled={!isFormValid()}
      >
        Sign Up
      </Button>
    </View>
  );
}

// https://coolors.co/403f4c-2c2b3c-1b2432-121420-b76d68
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121420',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    color: '#B76D68',
    fontSize: 18,
    padding: 10,
  },
  title: {
    color: '#403F4C',
    fontFamily: 'Lato',
    fontSize: 28,
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
    color: 'white',
    backgroundColor: '#2C2B3C',
    marginBottom: 10
  }
});
