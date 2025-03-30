import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Badge, Card, Text } from "react-native-paper";
import colors from "../theme/colors";


const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "#4CAF50";
    case "Rejected":
      return "#D32F2F";
    case "Expired":
      return "#757575";
    default:
      return colors.primary;
  }
};

export default function DoctorAppointmentsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const handleCardPress = (appointmentId: number) => {
    navigation.navigate("Prescription", { appointmentId });
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All Appointments</Text>
      {appointments.map((appointment) => (
        <Card
          key={appointment.id}
          style={styles.card}
          onPress={() => handleCardPress(appointment.id)}
        >
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
    backgroundColor: colors.background,
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
