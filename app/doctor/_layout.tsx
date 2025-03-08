import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppointmentsScreen from "./appointments";
import DoctorSettings from "./settings";
import DoctorDashboard from "./dashboard";
import PrescriptionScreen from "./prescription";
import MedicalCertificateScreen from "./medical-certificate";
import PrescriptionDetailsScreen from "./prescription-details";
import PatientDiagnosisScreen from "./patient-diagnosis";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../theme/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='DashboardMain' component={DoctorDashboard} />
      <Stack.Screen name='Prescription' component={PrescriptionScreen} />
      <Stack.Screen
        name='PatientDiagnosis'
        component={PatientDiagnosisScreen}
      />
      <Stack.Screen
        name='MedicalCertificate'
        component={MedicalCertificateScreen}
      />
      <Stack.Screen
        name='PrescriptionDetails'
        component={PrescriptionDetailsScreen}
      />
    </Stack.Navigator>
  );
}

function AppointmentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Appointments' component={AppointmentsScreen} />
      <Stack.Screen name='Prescription' component={PrescriptionScreen} />
      <Stack.Screen
        name='PatientDiagnosis'
        component={PatientDiagnosisScreen}
      />
      <Stack.Screen
        name='MedicalCertificate'
        component={MedicalCertificateScreen}
      />
      <Stack.Screen
        name='PrescriptionDetails'
        component={PrescriptionDetailsScreen}
      />
    </Stack.Navigator>
  );
}

export default function DoctorLayout() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
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
          let iconName: "calendar" | "cog" | "home" = "home";
          if (route.name === "AppointmentList") {
            iconName = "calendar";
          } else if (route.name === "Settings") {
            iconName = "cog";
          } else if (route.name == "Home") {
            iconName = "home";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name='Home' component={DashboardStack} />
      <Tab.Screen name='AppointmentList' component={AppointmentStack} />
      <Tab.Screen name='Settings' component={DoctorSettings} />
    </Tab.Navigator>
  );
}
