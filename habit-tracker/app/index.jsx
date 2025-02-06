<<<<<<< HEAD

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native'
=======
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
>>>>>>> origin/api
import { useEffect, useState } from 'react'
import { useRouter, useNavigation } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Menu } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PixelGrid } from '../components/PixelGrid'
import { Card } from '../components/ui/Card'
import { PaperProvider } from 'react-native-paper'
<<<<<<< HEAD

import { Image } from 'expo-image'
//import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import bannerImg from "@/assets/images/gridBackground.jpg"
//import { useEffect } from 'react'


import { useRouter, useRootNavigationState } from 'expo-router'

=======
import { useRootNavigationState } from 'expo-router'
>>>>>>> origin/api

const App = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const rootNavigationState = useRootNavigationState()
  const [habits, setHabits] = useState([])
  const [menuVisible, setMenuVisible] = useState(null)
  const [currentTitle, setCurrentTitle] = useState('One Day at a Time')

  const titles = [
    'One Day at a Time',
    'Small Steps, Big Changes', 
    'Building Better Habits',
    'Keep Going!',
    'You Got This!',
    'Progress Over Perfection',
    'Daily Check-In',
    'Consistency is Key',
    'Track & Grow',
    'Your Journey'
  ]

  useEffect(() => {
    // This sets the title to one of the titles in the titles array
    // feel free to add more :)
    setCurrentTitle(titles[Math.floor(Math.random() * titles.length)])
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: 'none' }
    })

  //   if (!rootNavigationState?.key) return

  //   // redirect to login page on load
  //   // we have major FOUC problem here
  //   // TODO: Implement async
  //   // TODO: Implement isLoading state
  //   router.replace('/auth/Login')
  // }, [rootNavigationState?.key])

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const stored = await AsyncStorage.getItem('@habits')
        if (stored) setHabits(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading habits:', error)
      }
    }

    const unsubscribe = navigation.addListener('focus', loadHabits)
    return unsubscribe
  }, [navigation])

  const handleToggle = async (index, date) => {
    try {
      const updatedHabits = [...habits]
      updatedHabits[index].trackingData[date] = !updatedHabits[index].trackingData[date]
      setHabits(updatedHabits)
      await AsyncStorage.setItem('@habits', JSON.stringify(updatedHabits))
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }

  const deleteHabit = async (index) => {
    try {
      const updatedHabits = habits.filter((_, i) => i !== index)
      setHabits(updatedHabits)
      await AsyncStorage.setItem('@habits', JSON.stringify(updatedHabits))
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const countCheckedDays = trackingData => Object.values(trackingData).filter(Boolean).length

  return (
    // TODO: refactor all below
    <PaperProvider>
      <View style={styles.mainContainer}>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('settings/settings')}
        >
          <Ionicons name="settings-outline" size={30} color="white" />
        </TouchableOpacity>

        <Text style={[styles.title, { marginTop: 70 }]}>{currentTitle}</Text>
        <Text style={styles.subtitle}>
          Welcome to your personal habit tracker.
        </Text>
        
        <TouchableOpacity 
          style={styles.addHabitButton}
          onPress={() => router.push('habit/add-habit')}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.addHabitText}>Add Habit</Text>
        </TouchableOpacity>

        <View style={styles.mainContent}>
          <ScrollView style={styles.habitList}>
            {habits.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, styles.emptyStateSubtext]}>
                  No habits yet
                </Text>
              </View>
            ) : (
              habits.map((habit, index) => (
                <Card key={index} style={styles.habitCard}>
                  <View style={styles.habitHeader}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <View style={styles.headerRight}>
                      {countCheckedDays(habit.trackingData) > 0 && (
                        <Text style={styles.streak}>
                          {countCheckedDays(habit.trackingData)} {countCheckedDays(habit.trackingData) === 1 ? 'Day' : 'Days'} 🔥
                        </Text>
                      )}
                      <Menu
                        visible={menuVisible === index}
                        onDismiss={() => setMenuVisible(null)}
                        anchor={
                          <TouchableOpacity onPress={() => setMenuVisible(index)}>
                            <Ionicons name="ellipsis-vertical" size={20} color="#E0DDCF" />
                          </TouchableOpacity>
                        }
                      >
                        <Menu.Item 
                          onPress={() => {
                            setMenuVisible(null)
                            router.push({
                              pathname: 'habit/edit-habit',
                              params: { habit: JSON.stringify(habit), index }
                            })
                          }} 
                          title="Edit" 
                        />
                        <Menu.Item 
                          onPress={() => {
                            setMenuVisible(null)
                            deleteHabit(index)
                          }} 
                          title="Delete" 
                        />
                      </Menu>
                    </View>
                  </View>
                  <Text style={styles.habitDescription}>{habit.description}</Text>
                  <PixelGrid 
                    trackingData={habit.trackingData}
                    onToggle={(date) => handleToggle(index, date)}
                    color={habit.color}
                  />
                </Card>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </PaperProvider>
  )
}

export default App

// roughly follows this color scheme
// https://coolors.co/393e41-d3d0cb-e2c044-587b7f-1e2019
const styles = StyleSheet.create({
  title: {
    color: '#D3D0CB',
    fontSize: 30,
    fontFamily: 'Lato',
    marginTop: 70,
    marginBottom: 0,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#888',
    fontFamily: 'Lato',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 50,
    paddingVertical: 20,
    maxWidth: '80%',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#1E2019',
    alignItems: 'center',
  },
  mainContent: {
    backgroundColor: "#587B7F",
    width: '90%',
    flexGrow: 0,
    flexShrink: 1,
    borderRadius: 20,
    minHeight: 0,
    justifyContent: 'center',
  },
  habitCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#343633',
    borderRadius: 10,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  addHabitButton: {
    backgroundColor: '#E2C044',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  addHabitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  habitList: {
    padding: 16,
    width: '100%',
  },
  habitName: {
    color: '#E0DDCF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  habitDescription: {
    color: '#ccc',
    marginBottom: 12,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streak: {
    color: '#E0DDCF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#E0DDCF',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
  },
})