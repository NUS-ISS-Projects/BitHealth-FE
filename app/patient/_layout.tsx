import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../theme/colors";
import home from "./home";
import PatientSettings from "./settings";
import PatientHistory from "./history";

const Tab = createBottomTabNavigator();

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
          } else if (route.name == "Home") {
            iconName = "home";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name='Home' component={home} />
      <Tab.Screen name='History' component={PatientHistory} />
      <Tab.Screen name='Settings' component={PatientSettings} />
    </Tab.Navigator>
  );
}
