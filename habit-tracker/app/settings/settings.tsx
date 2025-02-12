import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Link, router, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '../../components/ui/Card'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SettingsContent />
    </>
  )
}
const handleSignOut = async () => {
  try {
    await AsyncStorage.removeItem('@user_email'); // Clear the stored token
    console.log('User signed out successfully');
    //setHabits([]);
    router.replace('/'); // Redirect to login screen
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

function SettingsContent() {
  return (
    <View style={[styles.container]}>
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={30} color="white" />
      </Pressable>

      <Text style={[styles.title]}>Settings</Text>
      
      <Card style={styles.menuItem}>
        <Link href="/settings/account" asChild>
          <Pressable style={styles.menuContent}>
            <Ionicons name="person-outline" size={24} color="white" />
            <Text style={[styles.menuText]}>Account Settings</Text>
          </Pressable>
        </Link>
      </Card>

      <View style={styles.signOutContainer}>
        <Pressable 
          style={styles.signOutButton}
          onPress = {handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#121420',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'white',
    fontFamily: 'Lato',
  },
  menuItem: {
    padding: 16,
    backgroundColor: '#2C2B3C',
    borderRadius: 5,
    marginBottom: 12,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Lato',
  },
  backButton: {
    padding: 10,
    color: 'white',
  },
  signOutContainer: {
    marginTop: 'auto',
    marginBottom: 20,
    width: '80%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#2C2B3C',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  signOutText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    fontFamily: 'Lato',
  },
})
