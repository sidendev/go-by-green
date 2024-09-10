// navigation/TabNavigation.js
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useContext } from "react";
import ProfileScreen from "../Screen/ProfileScreen/ProfileScreen";
import SavedRoutes from "../Screen/SavedRoutes/SavedRoutes";
import HomeScreen from "../Screen/HomeScreen/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colours from "../Utils/Colours";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: 70, // height of the tab bar
        paddingTop: 10, // padding above the icon
        paddingBottom: 10, // padding below the label
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        fontWeight: '600',
      },
      tabBarIconStyle: {
        marginBottom: 5,
      },
    }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Search",
          tabBarActiveTintColor: Colours.GOBYGREEN_GREEN,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedRoutes"
        component={SavedRoutes}
        options={{
          tabBarLabel: "My Routes",
          tabBarActiveTintColor: Colours.GOBYGREEN_GREEN,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarActiveTintColor: Colours.GOBYGREEN_GREEN,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
