import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter, useNavigation } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Menu } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PixelGrid } from '../components/PixelGrid'
import { Card } from '../components/ui/Card'
import { PaperProvider } from 'react-native-paper'
import { useRootNavigationState } from 'expo-router'

const App = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const rootNavigationState = useRootNavigationState()
  const [habits, setHabits] = useState([])
  const [menuVisible, setMenuVisible] = useState(null)
  const [currentTitle, setCurrentTitle] = useState('One Day at a Time')

  const titles = [
    'Track Your Habits!', // Have the this title appear more often :D
    'Track Your Habits!',
    'Track Your Habits!',
    'Track Your Habits!',
    'Track Your Habits!',
    'One Day at a Time',
    'Small Steps, Big Changes', 
    'Building Better Habits',
    'Keep Going!',
    'You Got This!',
    'Progress Over Perfection',
    'Daily Check-In',
    'Consistency is Key',
    'Track & Grow',
    'Your Journey',
    'Every Step Counts',
    'Building Your Future',
    'Making It Happen',
    'Steady Progress',
    'Keep the Streak',
    'Small Wins Matter',
    'Your Daily Journey',
    'Growing Every Day',
    'Stay Committed',
    'Forward Motion'
  ]

  useEffect(() => {
    // This sets the title to one of the titles in the titles array
    // feel free to add more :)
    setCurrentTitle(titles[Math.floor(Math.random() * titles.length)])
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: 'none' }
    })

    if (!rootNavigationState?.key) return
    
  }, [rootNavigationState?.key])

  //This gets the user_email(unique), which was set in login.
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('@user_email');
        //const stored = await AsyncStorage.getItem('@habits')
        if (!userEmail) {
          setHabits([]); // Clear habits if no user is logged in
        } else {
          const userHabitsKey = `@habits_${userEmail}`; //habit for the email

          // SQL GET
          const stored = await AsyncStorage.getItem(userHabitsKey);
          if (stored) setHabits(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading habits:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadHabits)
    return unsubscribe
  }, [navigation])
  
  useEffect(() => {
    const checkUserLogin = async () => {
      try {

        // SQL GET HERE
        const userEmail = await AsyncStorage.getItem('@user_email');
        if (!userEmail) {
          setHabits([]); // Clear habits if the user is not logged in
          router.replace('/auth/Login'); // Redirects to login screen
        } 
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
  
    checkUserLogin();
  }, [rootNavigationState?.key]);

  const handleToggle = async (index, date) => {
    try {
      const updatedHabits = [...habits]
      updatedHabits[index].trackingData[date] = !updatedHabits[index].trackingData[date]
      setHabits(updatedHabits)
      // DB INSERT HERE
      await AsyncStorage.setItem('@habits', JSON.stringify(updatedHabits))
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }
  
  const handleAddHabit = async () => {
    try {

      // DB QUERY HERE
      const userToken = await AsyncStorage.getItem('@user_email'); // Assuming you store a token
      console.log('Stored Email:', userToken);
      if (userToken) {
        router.push('/habit/add-habit'); // Redirect to add habit screen
      } else {
        router.push('/auth/Login'); // Redirect to login screen
      }
    } catch (error) {
      console.error('Error checking user login:', error);
    }
  };
  
  const deleteHabit = async (index) => {
    try {
      const updatedHabits = habits.filter((_, i) => i !== index);
      setHabits(updatedHabits);

      const userEmail = await AsyncStorage.getItem('@user_email');
      if (userEmail) {
        const userHabitsKey = `@habits_${userEmail}`;

        // DB GO HERE
        await AsyncStorage.setItem(userHabitsKey, JSON.stringify(updatedHabits));
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };


  const countStreak = trackingData => Object.values(trackingData).filter(Boolean).length

  return (
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
                      {countStreak(habit.trackingData) > 0 && (
                        <Text style={styles.streak}>
                          {countStreak(habit.trackingData)} {countStreak(habit.trackingData) === 1 ? 'Day' : 'Days'} 🔥
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
                              params: { id: index }
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

        <TouchableOpacity 
          style={styles.fab}
          onPress={handleAddHabit}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </PaperProvider>
  )
}

export default App

// roughly follows this color scheme
// https://coolors.co/393e41-d3d0cb-e2c044-587b7f-1e2019
const styles = StyleSheet.create({
  title: {
    color: '#B76D68',
    fontSize: 30,
    fontFamily: 'Lato',
    marginTop: 70,
    marginBottom: 0,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#403F4C',
    fontFamily: 'Lato',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 50,
    paddingVertical: 20,
    maxWidth: '80%',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#121420',
    alignItems: 'center',
  },
  mainContent: {
    backgroundColor: "#2C2B3C",
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
    backgroundColor: '#121420',
    borderRadius: 10,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
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
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#B76D68',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})