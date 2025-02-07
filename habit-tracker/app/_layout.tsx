import { DarkTheme, DefaultTheme, ThemeProvider, NavigationContainer } from '@react-navigation/native';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from '../hooks/useAuth'
import { useColorScheme } from '@/hooks/useColorScheme';
import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';

SplashScreen.preventAutoHideAsync();

// creating the sqlite database
const colorScheme = useColorScheme();
const createDbIfNeeded = async (db: SQLiteDatabase) => {
  console.log("Creating database");
  try {
    // for developement purposes to get a clean table
    // comment out to save tables per expo app start
    let response = await db.execAsync(
      "DROP TABLE IF EXISTS users"
    );

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
    Montserrat: require('../assets/fonts/Montserrat-VariableFont_wght.ttf'),
    Lato: require('../assets/fonts/Lato-Black.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const db = openDatabaseSync('test.db');
  createDbIfNeeded(db);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </AuthProvider>
    </ThemeProvider>
  );
}
