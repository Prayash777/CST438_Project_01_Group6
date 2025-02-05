import { DarkTheme, DefaultTheme, ThemeProvider, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// database import
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// creating the sqlite database
const createDbIfNeeded = async (db: SQLiteDatabase) => {
  console.log("Creating database");
  try {
    let response;

    // for developement purposes to get a clean table
    // comment out to save tables per expo app start
    // let response = await db.execAsync(
    //   "DROP TABLE IF EXISTS users"
    // );

    // Create a table
    response = await db.execAsync(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)"
    );
    console.log("Database created", response);
  } catch (error) {
    console.error("Error creating database:", error);
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
        <Stack>
          <Stack.Screen name="auth/Login" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SQLiteProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );

  // return (
  //   <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  //     <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
  //       <Stack>
  //         {/* Why is this not working */}
  //         {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
  //         <Stack.Screen name="./auth/Login" />
  //         <Stack.Screen name="+not-found" />
  //       </Stack>
  //     </SQLiteProvider>
  //     <StatusBar style="auto" />
  //   </ThemeProvider>
  // );
}
