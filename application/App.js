import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './App/Navigations/TabNavigation.jsx';
import * as Location from 'expo-location';
import { LocationProvider } from './App/Context/LocationContext.jsx';
import React from 'react';
import { UserLocationContext } from './App/Context/UserLocationContext.jsx';
import { UserContext, UserProvider } from './App/Context/UserContext.jsx';
import { UserIdProvider, UserIdContext } from './App/Context/UserIdContext.jsx';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './App/Screen/ProfileScreen/ProfileScreen.jsx';
import SavedRoutes from './App/Screen/SavedRoutes/SavedRoutes.jsx';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function App() {
  const [loaded, error] = useFonts({
    outfit: require('./assets/fonts/Outfit-Regular.ttf'),
    'outfit-SemiBold': require('./assets/fonts/Outfit-SemiBold.ttf'),
    'outfit-Bold': require('./assets/fonts/Outfit-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [User, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <LocationProvider>
      <UserLocationContext.Provider value={{ location, setLocation }}>
        <UserProvider>
          <UserIdProvider>
            <View style={styles.container}>
              {/* <LoginScreen /> */}
              <NavigationContainer>
                <View style={styles.container}>
                  <Stack.Navigator initialRouteName="TabNavigation">
                    <Stack.Screen
                      name="TabNavigation"
                      component={TabNavigation}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="SavedRoutes" component={SavedRoutes} />
                    <Stack.Screen
                      name="ProfileScreen"
                      component={ProfileScreen}
                    />
                  </Stack.Navigator>
                </View>
                <StatusBar style="auto" />
              </NavigationContainer>
              <StatusBar style="auto" />
            </View>
          </UserIdProvider>
        </UserProvider>
      </UserLocationContext.Provider>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 25,
  },
});
