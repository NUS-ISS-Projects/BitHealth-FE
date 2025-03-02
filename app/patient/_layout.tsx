import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../theme/colors";
import Home from "./home";
import Book from "./book";
import AppointmentDate from "./appointmentDate";
import ConfirmAppointment from "./confirmAppointment";
import Confirmed from "./confirmed";
import PatientSettings from "./settings";
import PatientHistory from "./history";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppointmentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Book' component={Book} />
      <Stack.Screen name='AppointmentDate' component={AppointmentDate} />
      <Stack.Screen name='ConfirmAppointment' component={ConfirmAppointment} />
      <Stack.Screen name='Confirmed' component={Confirmed} />
    </Stack.Navigator>
  );
}

export default function PatientLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.textSecondary,
          height: 70,
          paddingTop: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: "clock-o" | "cog" | "home" = "home";
          if (route.name === "History") {
            iconName = "clock-o";
          } else if (route.name === "Settings") {
            iconName = "cog";
          } else if (route.name == "Default") {
            iconName = "home";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name='Default' component={AppointmentStack} />
      <Tab.Screen name='History' component={PatientHistory} />
      <Tab.Screen name='Settings' component={PatientSettings} />
    </Tab.Navigator>
  );
}
