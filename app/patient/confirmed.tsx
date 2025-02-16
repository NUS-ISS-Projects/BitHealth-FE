import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "../theme/colors";
import { Image } from "expo-image";

export default function AppointmentConfirmed() {
  const {
    doctor = "Dr. John Smith",
    date,
    location = "Komuk Express Semarang",
    time = "09:00",
  } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/check-green.gif")}
        style={styles.gif}
        contentFit='contain'
        cachePolicy='memory-disk'
      />

      {/* Confirmation Message */}
      <Text style={styles.header}>Appointment Confirmed!</Text>
      <Text style={styles.subText}>
        Your appointment with {doctor} on{" "}
        <Text style={styles.boldText}>
          {new Date(Array.isArray(date) ? date[0] : date).toDateString()}
        </Text>
        , <Text style={styles.boldText}>{time}</Text> at{" "}
        <Text style={styles.boldText}>{location}</Text> is confirmed.
      </Text>

      {/* Proceed Button */}
      <Button
        mode='contained'
        style={styles.bookButton}
        labelStyle={styles.bookButtonText}
        onPress={() => router.push("/patient")}
      >
        Return to home page
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  gif: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    paddingBottom: 15,
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    color: colors.textSecondary,
    paddingBottom: 50,
  },
  timeLeft: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    width: "80%",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
