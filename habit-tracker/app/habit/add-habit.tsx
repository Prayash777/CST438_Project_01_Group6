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

  //It is used as a unique id.
  const getUserEmail = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('@user_email')// get it from your login page
      return userEmail;
    } catch (error) {
      console.error('Error retrieving user email:', error)
      return null;
    }
  }
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

      const userEmail = await getUserEmail()

      if(!userEmail){
        alert('No user logged in')
        return
      }
      //creating a unique key
       const userHabitsKey = `@habits_${userEmail}`

      const existingHabits = await AsyncStorage.getItem(userHabitsKey)
      const habits = existingHabits ? JSON.parse(existingHabits) : []
      
      habits.push(newHabit)
      
      await AsyncStorage.setItem(userHabitsKey, JSON.stringify(habits))
    } catch (error) {
      console.error('Error saving habit:', error)
    }

    router.push('/')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Add New Habit</Text>

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
    backgroundColor: '#121420',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    marginTop: 20,
    color: '#B76D68',
    fontFamily: 'Lato',
    textAlign: 'center',
  },
  form: {
    padding: 16,
    gap: 16,
    backgroundColor: '#2C2B3C',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#403F4C',
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
  button: {
    marginTop: 16,
    backgroundColor: '#B76D68',
    padding: 12,
    borderRadius: 5,
  },
  backButton: {
    color: 'white',
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: 'white',
  },
})
