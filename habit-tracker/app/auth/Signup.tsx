import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',

// import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
// import { useSQLiteContext } from "expo-sqlite";

// const database = useSQLiteContext();

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
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

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        window.location.href = '/';

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

    <View style={styles.signupContainer}>
      <View style={styles.header}>
        <Text
          style={styles.backButton}
          onPress={() => router.push('/auth/Login')}
        >
          {/* I love arrows in plain text, huge difference */}
          ← Back
        </Text>
      </View>
      <Text style={styles.title}>Sign up to Start Tracking Today!</Text>
      <form onSubmit={handleSubmit} className={cssStyles.form}>
        <div className={cssStyles.formGroup}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className={cssStyles.input}
            required
          />
        </div>
        <div className={cssStyles.formGroup}>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Password"
            className={cssStyles.input}
            required
          />
        </div>
        <div className={cssStyles.formGroup}>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm Password"
            className={cssStyles.input}
            required

            // because I am evil:
            onPaste={(e) => {
              e.preventDefault();
              // alerts are annoying af, it is enough to just silently prohibit pasting
              // alert('Please type your password to confirm');
            }}
          />
        </div>
        <div className={cssStyles.formGroup}>
          <button type="submit" className={`${cssStyles.button} ${cssStyles.buttonSpacing}`}>Sign Up</button>
        </div>
      </form>

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

