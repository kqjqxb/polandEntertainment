import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { loadUserData } from './src/redux/userSlice';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { TailwindProvider } from 'tailwind-rn';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import utilities from './tailwind.json';
import { Provider, useDispatch } from 'react-redux';
import { UserProvider, UserContext } from './src/context/UserContext';
import store from './src/redux/store';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const PolandStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
            <TailwindProvider utilities={utilities}>
              <SafeAreaProvider>
                <AppNavigator />
              </SafeAreaProvider>
            </TailwindProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);
  const [initializingPolandApp, setInitializingMinSpiritApp] = useState(true);
  const [onboardVisible, setOnboardVisible] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadThisUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedUser = await AsyncStorage.getItem(storageKey);
        const isOnboardingWasStarted = await AsyncStorage.getItem('isOnboardingWasStarted');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setOnboardVisible(false);
        } else if (isOnboardingWasStarted) {
          setOnboardVisible(false);
        } else {
          setOnboardVisible(true);
          await AsyncStorage.setItem('isOnboardingWasStarted', 'true');
        }
      } catch (error) {
        console.error('Error cur loading of user', error);
      } finally {
        setInitializingMinSpiritApp(false);
      }
    };
    loadThisUser();
  }, [setUser]);

  if (initializingPolandApp) {
    return (
      <View style={{
        backgroundColor: '#020202',  
        alignItems: 'center',  
        flex: 1, 
        justifyContent: 'center', 
        }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default PolandStack;
