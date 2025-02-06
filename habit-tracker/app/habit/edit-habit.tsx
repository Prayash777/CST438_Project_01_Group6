import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router, useNavigation, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function EditHabit() {
  const navigation = useNavigation()
  const { id } = useLocalSearchParams()
  
  const [habitData, setHabitData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    startDate: '',
    trackingData: {} as Record<string, boolean>
  })

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: {
        display: 'none'
      }
    })
    loadHabitData()
  }, [navigation])

  const loadHabitData = async () => {
    try {
      const existingHabits = await AsyncStorage.getItem('@habits')
      const habits = existingHabits ? JSON.parse(existingHabits) : []
      const habit = habits[Number(id)]
      if (habit) {
        setHabitData(habit)
      }
    } catch (error) {
      console.error('Error loading habit:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      const existingHabits = await AsyncStorage.getItem('@habits')
      const habits = existingHabits ? JSON.parse(existingHabits) : []
      
      habits[Number(id)] = habitData
      
      await AsyncStorage.setItem('@habits', JSON.stringify(habits))
    } catch (error) {
      console.error('Error updating habit:', error)
    }

    router.back()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Habit</Text>

      <Card style={styles.form}>
        <Input
          value={habitData.name}
          onChangeText={(text) => setHabitData({...habitData, name: text})}
          placeholder="Enter habit name"
        />

        <Input
          value={habitData.description}
          onChangeText={(text) => setHabitData({...habitData, description: text})}
          placeholder="Enter description"
          multiline
        />

        <Button onPress={handleSubmit} style={styles.button}>
          Update Habit
        </Button>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    marginTop: 20,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  button: {
    marginTop: 16,
  },
  backButton: {
    color: 'black',
    fontSize: 18,
    padding: 10,
  },
})
