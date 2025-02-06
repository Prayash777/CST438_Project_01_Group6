import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function AddHabit() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: {
        display: 'none'
      }
    })
  }, [navigation])

  const [habitData, setHabitData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    startDate: new Date().toISOString(),
    trackingData: {} as Record<string, boolean>,
    color: '#4CAF50'
  })

  const handleSubmit = async () => {
    const trackingData: Record<string, boolean> = {}
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      trackingData[date.toISOString().split('T')[0]] = false
    }

    const newHabit = {
      ...habitData,
      trackingData
    }

    try {
      const existingHabits = await AsyncStorage.getItem('@habits')
      const habits = existingHabits ? JSON.parse(existingHabits) : []
      
      habits.push(newHabit)
      
      await AsyncStorage.setItem('@habits', JSON.stringify(habits))
    } catch (error) {
      console.error('Error saving habit:', error)
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

      <Text style={styles.title}>Add New Habit</Text>

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

        <View style={styles.colorPicker}>
          <View style={styles.colorOptions}>
            {['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336'].map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  habitData.color === color && styles.selectedColor
                ]}
                onPress={() => setHabitData({...habitData, color: color})}
              />
            ))}
          </View>
        </View>

        <Button onPress={handleSubmit} style={styles.button}>
          Create Habit
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
  colorPicker: {
    marginTop: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
})
