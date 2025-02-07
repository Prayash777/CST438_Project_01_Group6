/*

TODO: Eventually, I want this app to allow users to view the default home page without loggin in. When the user tries to create a habit, they will be redirected to the login page.
I despise websites that force users to login before they can view the home page. Probably steers >80% of users away. -ethan
*/

import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, GestureResponderEvent,TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, ThemeProvider } from '../../hooks/useTheme';
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Ionicons } from '@expo/vector-icons';

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
    <><ThemeProvider>
        <SQLiteProvider databaseName="habit-tracker.db">
          <LoginContentWrapper formData={formData} setFormData={setFormData} router={router} />
        </SQLiteProvider>
      </ThemeProvider></>
  );
}

// Create a wrapper component to use the SQLite context
function LoginContentWrapper({ formData, setFormData, router }: Omit<LoginContentProps, 'database'>) {
  const database = useSQLiteContext();
  return <LoginContent formData={formData} setFormData={setFormData} database={database} router={router} />;
}

function LoginContent({ formData, setFormData, database, router }: LoginContentProps) {
  const { theme } = useTheme();

  const handleSubmit = async () => {
    try {
      await AsyncStorage.setItem('user_email', formData.email);
      
      // TODO: Implement actual API authentication
      router.push('../index');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  const handleInsertUserAccount = async () => {
    try {
      const { email, password } = formData;
      await database.runAsync(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, password]
      );
      router.push('/'); // Navigate after successful signup
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account");
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
    <View style={[styles.loginContainer, { backgroundColor: theme.colors.background }]}>
     <TouchableOpacity 
             style={styles.backButton}
             onPress={() => router.back()}
           >
             <Ionicons name="arrow-back" size={30} color="black" />
           </TouchableOpacity>


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
          />
        </View>
        <View style={styles.buttonContainer}>
        </View>
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
    position: 'absolute',
    top: 70,
    left: 20,
    zIndex: 1,
  },
});