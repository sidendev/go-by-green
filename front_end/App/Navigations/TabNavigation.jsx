// navigation/TabNavigation.js
import { StyleSheet, Text, View } from "react-native";
import React, {useState, useContext} from "react";
import LoginScreen from "../Screen/LoginScreen/LoginScreen";
import ProfileScreen from "../Screen/ProfileScreen/ProfileScreen";
import SavedRoutes from "../Screen/SavedRoutes/SavedRoutes";
import HomeScreen from "../Screen/HomeScreen/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Colours from "../Utils/Colours";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Search",
          tabBarActiveTintColor: Colours.PRIMARY,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedRoutes"
        component={SavedRoutes}
        options={{
          tabBarLabel: "Saved Routes",
          tabBarActiveTintColor: Colours.PRIMARY,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarActiveTintColor: Colours.PRIMARY,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
