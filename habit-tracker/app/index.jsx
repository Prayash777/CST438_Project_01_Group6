import { Image } from 'expo-image'
import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import bannerImg from "@/assets/images/gridBackground.jpg"
import { useEffect } from 'react'
import { useRouter, useRootNavigationState } from 'expo-router'

const app = () => {
  const router = useRouter()
  const rootNavigationState = useRootNavigationState()

  // logging
  console.log("rootNavigationState", rootNavigationState)

  useEffect(() => {
    if (!rootNavigationState?.key) return
    
    // redirect to login page on load
    // we have major FOUC problem here
    // TODO: Implement async
    // TODO: Implement isLoading state
    router.replace('/auth/Login')
  }, [rootNavigationState?.key])

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Habit tracker</Text>
      <View style={styles.mainContent}>

        {/* how to add a backround image */}
        {/* <ImageBackground source={bannerImg} style={styles.image}>

      </ImageBackground> */}

        {/* how to add an image */}
        {/* <Image
          style={styles.image}
          source={bannerImg}
        /> */}
      </View>
    </View>
  )
}
export default app

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1, // make container takup whole screen(width/height)
    backgroundColor: 'black',
    alignItems: 'center',
    //justifyContent: 'center',
    //marginTop: '10px',
  },
  mainContent: {
    backgroundColor: "#0553",
    width: '90%',
    height: '90%',
    borderRadius: '10%',
    border: "solid white",
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 50,
  },
  img: {
    width: '30%',
    height: '90%',
  },
  image: {
    flex: 1,
    width: '90%',
    backgroundColor: '#0553',
    borderRadius: '10%',
    border: "solid white",
  },
})