import { useState, FormEvent } from 'react';
import cssStyles from './Login.module.css';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {    
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
    confirmPassword: ''
  });

  // TODO: DB and api
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
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

// TODO: I'm still confused if styles are in the right file, what the convention for this is. still working tho.
const styles = StyleSheet.create({
  signupContainer: {
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

export default Signup;