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
      
      habits[Number(id)] = {
        ...habits[Number(id)],
        ...habitData,
      }
      
      await AsyncStorage.setItem('@habits', JSON.stringify(habits))
      router.back()
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Habit</Text>

      <Card style={styles.form}>
        <Input
          value={habitData.name}
          onChangeText={(text) => setHabitData({...habitData, name: text})}
          placeholder="Enter habit name"
          style={styles.input}
        />

        <Input
          value={habitData.description}
          onChangeText={(text) => setHabitData({...habitData, description: text})}
          placeholder="Enter description"
          multiline
          style={styles.input}
        />

        <Button 
          onPress={handleSubmit} 
          style={styles.updateButton}
        >
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
    backgroundColor: '#121420',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    marginTop: 20,
    color: '#B76D68',
    textAlign: 'center',
  },
  form: {
    padding: 16,
    gap: 16,
    backgroundColor: '#2C2B3C',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#403F4C',
    color: 'white',
    backgroundColor: '#2C2B3C',
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#B76D68',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    color: 'white',
    fontSize: 18,
    padding: 10,
  },
})
