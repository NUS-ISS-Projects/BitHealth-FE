import { View, Text, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../theme/colors";

export default function ConfirmAppointment() {
  const { doctor, date, time } = useLocalSearchParams();
  const router = useRouter();

  const handleConfirmBooking = async () => {
    const appointment = {
      doctor,
      date,
      time,
      status: "Pending",
    };

    // Save to AsyncStorage (or send to backend)
    await AsyncStorage.setItem("appointment", JSON.stringify(appointment));

    // Navigate back to Patient Home
    //router.push("/patient");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Does everything look correct?</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Doctor:</Text>
        <Text style={styles.value}>{doctor || "Not Selected"}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{date || "Select Date"}</Text>

        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{time || "Select Time"}</Text>

        <Text style={styles.status}>Status: Pending</Text>
      </View>

      <CustomButton title='Confirm Booking' onPress={handleConfirmBooking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 10,
    fontWeight: "bold",
  },
});
