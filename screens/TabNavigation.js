import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Pressable } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Home from '../Tabs/Home';
import SavedJobs from '../Tabs/SavedJobs';
import Profile from '../Tabs/Profile';

const Tabs = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tabs.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Saved" component={SavedJobs} />
      <Tabs.Screen name="Profile" component={Profile} />
    </Tabs.Navigator>
  );
};

const CustomTabBar = ({
  state: { index: activeIndex, routes },
  navigation,
}) => {
  return (
    <View style={styles.tabBar}>
      {routes.map((route, index) => {
        const active = index === activeIndex;
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabItem, active && styles.activeTab]}
          >
            <Ionicons
              name={getIconName(route.name)}
              size={24}
              color={active ? '#0672d6' : 'gray'}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const getIconName = name => {
  switch (name) {
    case 'Home':
      return 'home-outline';
    case 'Saved':
      return 'bookmark-outline';
    case 'Profile':
      return 'person-outline';
    default:
      return 'ellipse';
  }
};

export default TabNavigation;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 55,
    backgroundColor: '#fff',
    elevation: 5,
  },
  tabItem: {
    height: 45,
    width: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // activeTab: {
  //   backgroundColor: '#0672d6',
  // },
});
