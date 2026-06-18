// // // appnavigator.js

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { FontAwesome5, MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import TaskListScreen from './screens/TaskListScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import UpdateTaskScreen from './screens/UpdateTaskScreen';
import PomodoroScreen from './screens/PomodoroScreen';
import WelAppScreen from './screens/WelAppScreen';
import ProgressReportScreen from './screens/ProgressReportScreen';
import MotivationalHeader from './components/MotivationalHeader';
import AuthScreen from './screens/AuthScreen';
import GameScreen from './screens/GameScreen';
import UserProfileScreen from './screens/UserScreen'; // Import UserProfileScreen
import { auth } from './firebase';
import CompletedTasksScreen from './screens/CompletedTasksScreen';
import { COLORS, FONTS, SPACING } from './utils/theme';



// Custom drawer content component
const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerHeader}>
      <Text style={styles.drawerTitle}>Tola</Text>
    </View>
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

//Const navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        headerTitle: () => <MotivationalHeader />,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
      }}
    />
    <Stack.Screen 
      name="UpdateTask" 
      component={UpdateTaskScreen} 
      options={{ 
        title: 'Task Details',
        headerTitleStyle: { fontFamily: FONTS.bubbles, color: COLORS.white },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white
      }} 
    />
  </Stack.Navigator>
);

const TaskCStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CompletedTasks"
      component={CompletedTasksScreen}
      options={{ 
        headerShown: true, 
        title: 'Mission History',
        headerTitleStyle: { fontFamily: FONTS.bubbles, color: COLORS.white },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white
      }} 
    />
    <Stack.Screen 
      name="UpdateTask" 
      component={UpdateTaskScreen} 
      options={{ 
        title: 'Task Details',
        headerTitleStyle: { fontFamily: FONTS.bubbles, color: COLORS.white },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white
      }} 
    />
  </Stack.Navigator>
);

const TaskStackNavigator = () => (
  <Stack.Navigator >
    <Stack.Screen 
      name="TaskList" 
      component={TaskListScreen} 
      options={{ 
        title: 'Mission Control',
        headerTitleStyle: { fontFamily: FONTS.bubbles, color: COLORS.white },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white
      }} 
    />
    <Stack.Screen 
      name="UpdateTask" 
      component={UpdateTaskScreen} 
      options={{ 
        title: 'Update Mission',
        headerTitleStyle: { fontFamily: FONTS.bubbles, color: COLORS.white },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white
      }} 
    />
    <Stack.Screen 
      name="AddTask" 
      component={AddTaskScreen} 
      options={{ 
        title: 'New Mission',
        headerTitleStyle: { fontFamily: FONTS.bubbles, color: COLORS.white },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white
      }} 
    />
  </Stack.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Main"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontFamily: FONTS.bubbles },
      drawerActiveTintColor: COLORS.primary,
      drawerInactiveTintColor: COLORS.textSecondary,
      drawerIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Main':
            iconName = 'home';
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          case 'Game':
            iconName = 'gamepad';
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          case 'Progress Report':
             iconName = 'barschart';
             return <AntDesign name={iconName} size={size} color={color} />;
          case 'Profile':
             iconName = 'user';
             return <AntDesign name={iconName} size={size} color={color} />;
          case 'Completed Tasks':
             iconName = 'checkmark-done';
             return <Ionicons name={iconName} size={size} color={color} />;
          default:
            return null;
        }
      },
    })}
  >
   
    <Drawer.Screen
      name="Main" 
      component={TabNavigator}
      options={{
        title: 'Home', // Label for the drawer
        headerShown: false, // Hide the header when navigating to Home
      }}
    />
    <Drawer.Screen name="Game" component={GameScreen} />
    <Drawer.Screen name="Progress Report" component={ProgressReportScreen} />
    <Drawer.Screen name="Completed Tasks" component={TaskCStackNavigator} />
    <Drawer.Screen name="Profile" component={UserProfileScreen} />
  </Drawer.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="HomeStack"
      component={HomeStackNavigator}
      options={{ 
        title: 'Home', // Label for the tab bar
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Tasks"
      component={TaskStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="tasks" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Add Task"
      component={AddTaskScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="add-task" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Pomodoro"
      component={PomodoroScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="timer" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);



const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
      setIsLoading(false); // Set loading to false after checking auth status
    });

    return () => unsubscribe();
  }, []);

 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelAppScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="AppDrawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: SPACING.l,
    backgroundColor: COLORS.primary, // Background color of the drawer header
  },
  drawerTitle: {
    fontSize: 32,
    fontFamily: FONTS.bubbles,
    color: COLORS.white,
  },
});

export default AppNavigator;
