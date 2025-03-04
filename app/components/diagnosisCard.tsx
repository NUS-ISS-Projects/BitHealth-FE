import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import colors from "../theme/colors";

export default function DiagnosisSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Diagnosis</Text>
      <Text style={styles.sectionTitle}>Your Diagnosis</Text>
      <Text style={styles.bodyText}>
        J06.9 – Acute upper respiratory infection, unspecified
      </Text>
      <Text style={styles.sectionTitle}>What You Should Do</Text>
      <Text style={styles.bodyText}>Take a good rest and get well soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});
