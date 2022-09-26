/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import ProfileScreen from './ProfileScreen';


const HomeStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      activeColor="#fff"
      barStyle={{ backgroundColor: '#07575b' }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-outline" color={color} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default MainTabScreen;











/////////////////////////////////////////////////////////
const HomeStackScreen = () => {
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
    backgroundColor: '#1f65ff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
    fontWeight: 'bold'
    }
}}>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
      title: 'HomeStack',
      headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#1f65ff" onPress={() => navigation.openDrawer()}></Icon.Button>
    )
    }}></HomeStack.Screen>
  </HomeStack.Navigator>
}

const HistoryStackScreen = () => {
  <HistoryStack.Navigator screenOptions={{
    headerStyle: {
    backgroundColor: '#1f65ff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
    fontWeight: 'bold'
    }
}}>
    <HistoryStack.Screen name="Home" component={HistoryScreen} options={{
      title: 'HistoryStack',
      headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#07575b" onPress={() => navigation.openDrawer()}></Icon.Button>
    )
    }}></HistoryStack.Screen>
  </HistoryStack.Navigator>
}

const ProfileStackScreen = () => {
  <ProfileStack.Navigator screenOptions={{
    headerStyle: {
    backgroundColor: '#1f65ff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
    fontWeight: 'bold'
    }
}}>
    <ProfileStack.Screen name="ProfileStack" component={ProfileScreen} options={{
      title: 'Profile',
      headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#1f65ff" onPress={() => navigation.openDrawer()}></Icon.Button>
    )
    }}></ProfileStack.Screen>
  </ProfileStack.Navigator>
}