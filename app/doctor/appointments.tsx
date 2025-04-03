import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { Text, Card, Badge } from "react-native-paper";
import colors from "../theme/colors";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { formatDate, formatTime } from "../helper/dateTimeFormatter";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "#4CAF50";
    case "REJECTED":
      return "#D32F2F";
    case "EXPIRED":
      return "#757575";
    default:
      return colors.primary;
  }
};

export default function DoctorAppointmentsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/appointments/doctor/2`);
      setAppointments(response.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCardPress = (appointmentId: number) => {
    navigation.navigate("Prescription", { appointmentId });
  };

  if (loading) {
    return <ActivityIndicator size='large' color={colors.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All Appointments</Text>
      {appointments.map((appointment) => (
        <Card
          key={appointment.appointmentId}
          style={styles.card}
          onPress={() => handleCardPress(appointment.appointmentId)}
        >
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoContainer}>
              <Text style={styles.patientName}>
                {appointment.patient.user.name}
              </Text>
              <Text style={styles.details}>
                {formatDate(appointment.appointmentDate)} |{" "}
                {formatTime(appointment.appointmentTime)}
              </Text>
            </View>
            <Badge
              style={[
                styles.badge,
                { backgroundColor: getStatusColor(appointment.status) },
              ]}
            >
              {appointment.status}
            </Badge>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: colors.cardBackground,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  details: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  badge: {
    fontSize: 8,
    color: "#FFFFFF",
    borderRadius: 4,
    height: 30,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});
