import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Link, router, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '../../components/ui/Card'

export default function Settings() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SettingsContent />
    </>
  )
}

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
          onPress={() => router.replace('/auth/Login')}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  menuItem: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '500',
  },
  backButton: {
    padding: 10,
  },
  signOutContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  signOutText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '500',
    color: '#FF3B30',
  },
})
