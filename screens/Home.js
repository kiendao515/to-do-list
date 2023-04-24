import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Task from "./Task";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from './Dashboard.js';
import Statistic from './Statistic';
const Tab = createBottomTabNavigator();
const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route}) => ({
        headerShown:false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Task') {
            iconName = focused
              ? 'ios-list' : 'ios-list-outline';
          } else if (route.name === 'Statistic') {
            iconName = focused ? 'calendar-sharp' : 'calendar-outline';
          }else if(route.name==='User')
          iconName = focused ? 'person-circle' : 'person-circle-outline';
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen screenOptions={{
        headerShown: false,
      }} name="Task" component={Task} />
      <Tab.Screen name="User" component={Dashboard} />
      <Tab.Screen screenOptions={{
        headerShown: false,
      }} name="Statistic" component={Statistic} />
    </Tab.Navigator>
  )
}
export default Home
