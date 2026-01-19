import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import FlashMessage from 'react-native-flash-message';
import { View } from 'react-native';
import Description from '../Components/Description';
import { ProfileProvider } from '../Store/userContext';
const Stack = createStackNavigator();
const StackNavigation = () => {
  return (
    <>
      <ProfileProvider>
        <View style={{ marginHorizontal: 15 }}>
          <FlashMessage position="top" />
        </View>
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={TabNavigation}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Description"
            component={Description}
            options={{ headerShown: false }}
          ></Stack.Screen>
        </Stack.Navigator>
      </ProfileProvider>
    </>
  );
};

export default StackNavigation;
