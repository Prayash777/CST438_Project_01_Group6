import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { router, useNavigation } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function AccountSettings() {
  const navigation = useNavigation()  

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: {
        display: 'none'
      }
    });
  }, [navigation]);

  const { username, updateUser, deleteAccount } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    name: username || '',
    email: username || '',
  })

  const handleUpdate = async () => {
    try {
      await updateUser(formData)
      setMessage({ type: 'success', text: 'Account updated successfully' })
      setIsEditing(false)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update account' })
    }
  }

  const handleDelete = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount()
              // Redirect will be handled by auth state change
            } catch (error) {
              setMessage({ type: 'error', text: 'Failed to delete account' })
            }
          },
        },
      ]
    )
  }

  return (
    <View style={[styles.container]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <Text style={[styles.title]}>Account Settings</Text>
      
      <Card style={[styles.cardContent]}>
        {message.text && (
          <View style={[styles.alert, message.type === 'error' ? styles.alertError : styles.alertSuccess]}>
            <Text style={styles.alertText}>{message.text}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={[styles.label]}>Name</Text>
            <Input
              value={formData.name}
              editable={isEditing}
              onChangeText={(value) => setFormData({ ...formData, name: value })}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label]}>Email</Text>
            <Input
              value={formData.email}
              editable={isEditing}
              onChangeText={(value) => setFormData({ ...formData, email: value })}
              keyboardType="email-address"
            />
          </View>

          {isEditing ? (
            <View style={styles.buttonGroup}>
              <Button onPress={handleUpdate}>Save Changes</Button>
              <Button 
                variant="outline"
                onPress={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </View>
          ) : (
            <Button onPress={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </View>
      </Card>

      <Card style={[styles.deleteCard]}>
        <Button 
          variant="danger"
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          Delete Account
        </Button>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 48,
    backgroundColor: '#121420',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 34,
    color: 'white',
    fontFamily: 'Lato',
  },
  cardContent: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#2C2B3C',
    borderWidth: 1,
    borderColor: '#403F4C',
  },
  deleteCard: {
    backgroundColor: '#1D1C2C',
    borderWidth: 1,
    borderColor: '#403F4C',
    padding: 16,
    marginVertical: 375,
  },
  deleteButton: {
    width: '100%',
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    color: 'white',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  alert: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  alertSuccess: {
    backgroundColor: '#1C3A2B',
  },
  alertError: {
    backgroundColor: '#3A2828',
  },
  alertText: {
    color: 'white',
  },
  backButton: {
    padding: 20,
    color: 'white',
  },
})