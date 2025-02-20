import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import colors from "./theme/colors";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo and Welcome Section */}
      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/images/bithealth-logo.png")}
          style={styles.logo}
        />
        <Text variant='headlineMedium' style={styles.welcomeText}>
          Welcome to BitHealth
        </Text>
      </View>

      {/* Role Selection Buttons */}
      <View style={styles.buttonContainer}>
        <Text variant='bodyLarge' style={styles.subtitleText}>
          If you are a patient continue here:
        </Text>
        <Button
          mode='contained'
          style={styles.roleButton}
          labelStyle={styles.roleText}
          onPress={() =>
            router.push({
              pathname: "/auth/login",
              params: { userType: "patient" },
            })
          }
        >
          Continue as a patient
        </Button>
        <View style={{ paddingTop: 25 }}>
          <Text variant='bodyLarge' style={styles.subtitleText}>
            If you are a doctor continue here:
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/auth/login",
                params: { userType: "doctor" },
              })
            }
          >
            <Text style={styles.linkText}>Continue as a doctor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitleText: {
    color: colors.textPrimary,
    textAlign: "center",
    fontWeight: "600",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  roleButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 10,
  },
  roleText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
    textDecorationLine: "underline",
    textAlign: "center",
    paddingTop: 15,
    fontWeight: "800",
  },
});
