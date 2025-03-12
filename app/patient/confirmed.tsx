import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import colors from "../theme/colors";
import { Image } from "expo-image";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

type AppointmentParams = {
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  isRescheduling: boolean;
};

export default function AppointmentConfirmed() {
  const route = useRoute();
  const { doctorName, appointmentDate, appointmentTime, isRescheduling } =
    route.params as AppointmentParams;
  const navigation = useNavigation<NavigationProp<any>>();

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes.slice(0, 2)} ${ampm}`;
  };

  const getMessage = () => {
    if (isRescheduling) {
      return {
        header: "Appointment Rescheduled!",
        subText: `Your appointment with ${doctorName} has been rescheduled to ${formatDate(
          appointmentDate
        )}, ${formatTime(appointmentTime)}.`,
      };
    }
    return {
      header: "Appointment Confirmed!",
      subText: `Your appointment with ${doctorName} on ${formatDate(
        appointmentDate
      )}, ${formatTime(appointmentTime)} is confirmed.`,
    };
  };

  const { header, subText } = getMessage();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/check-green.gif")}
        style={styles.gif}
        contentFit='contain'
        cachePolicy='memory-disk'
      />

      {/* Confirmation Message */}
      <Text style={styles.header}>{header}</Text>
      <Text style={styles.subText}>{subText}</Text>

      {/* Proceed Button */}
      <Button
        mode='contained'
        style={styles.bookButton}
        labelStyle={styles.bookButtonText}
        onPress={() => navigation.navigate("Home")}
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
