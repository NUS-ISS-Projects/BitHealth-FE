import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Card, Badge } from "react-native-paper";
import colors from "../theme/colors";

const appointments = [
  {
    id: 1,
    patientName: "Alice Johnson",
    date: "2024-07-01",
    time: "10:00 AM",
    status: "Completed",
  },
  {
    id: 2,
    patientName: "Bob Smith",
    date: "2024-07-02",
    time: "11:00 AM",
    status: "Expired",
  },
  {
    id: 3,
    patientName: "Charlie Brown",
    date: "2024-07-03",
    time: "02:00 PM",
    status: "Rejected",
  },
  // Add more mock data as needed
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "#4CAF50"; // Green
    case "Rejected":
      return "#D32F2F"; // Red
    case "Expired":
      return "#757575"; // Grey
    default:
      return colors.primary;
  }
};

export default function DoctorAppointmentsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All Appointments</Text>
      {appointments.map((appointment) => (
        <Card key={appointment.id} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoContainer}>
              <Text style={styles.patientName}>{appointment.patientName}</Text>
              <Text style={styles.details}>
                {appointment.date} | {appointment.time}
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
    backgroundColor: colors.background, // e.g., soft beige or your chosen background color
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: colors.cardBackground, // e.g., white
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
    fontSize: 12,
    color: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
