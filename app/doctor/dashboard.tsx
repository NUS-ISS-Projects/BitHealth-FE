import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text, Card, Avatar, Button, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import colors from "../theme/colors";

const mockConfirmedAppointments = [
  {
    id: 1,
    patientName: "Ferdi Klakson",
    time: "10:00 AM",
    reason: "General Checkup",
    avatar: require("../../assets/images/favicon.png"),
  },
  {
    id: 2,
    patientName: "Yuda Bukan Main",
    time: "11:30 AM",
    reason: "Follow-up",
    avatar: require("../../assets/images/favicon.png"),
  },
];

const mockPendingRequests = [
  {
    id: 3,
    patientName: "Alicia Keys",
    time: "2:00 PM",
    reason: "Skin Consultation",
    avatar: require("../../assets/images/favicon.png"),
  },
  {
    id: 4,
    patientName: "Bob Martin",
    time: "2:30 PM",
    reason: "Medication Refill",
    avatar: require("../../assets/images/favicon.png"),
  },
];

export default function DoctorDashboard() {
  const [confirmedAppointments, setConfirmedAppointments] = useState(
    mockConfirmedAppointments
  );
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const router = useRouter();

  const handleConfirm = (requestId: any) => {
    const request = pendingRequests.find((r) => r.id === requestId);
    if (request) {
      setConfirmedAppointments([...confirmedAppointments, request]);
      setPendingRequests(pendingRequests.filter((r) => r.id !== requestId));
    }
  };

  const handleReject = (requestId: any) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== requestId));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Avatar.Image
            size={50}
            source={require("../../assets/images/favicon.png")}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.doctorName}>Dr. Budi Sound</Text>
            <Text style={styles.doctorSpecialty}>Aesthetic Doctor</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/doctor/profile")}>
          <Avatar.Icon
            size={40}
            icon='cog-outline'
            style={{ backgroundColor: colors.primary }}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Today's Appointments</Text>
      {/* Confirmed Appointments */}
      {confirmedAppointments.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>
              No confirmed appointments for today.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        confirmedAppointments.map((appointment) => (
          <Card key={appointment.id} style={styles.appointmentCard}>
            <Card.Content style={styles.cardContent}>
              <Avatar.Image size={50} source={appointment.avatar} />
              <View style={styles.infoContainer}>
                <Text style={styles.patientName}>
                  {appointment.patientName}
                </Text>
                <Text style={styles.reason}>{appointment.reason}</Text>
                <Text style={styles.time}>{appointment.time}</Text>
              </View>
              <Button
                mode='outlined'
                onPress={() =>
                  router.push(
                    `/doctor/prescription?appointmentId=${appointment.id}`
                  )
                }
              >
                Prescribe
              </Button>
            </Card.Content>
          </Card>
        ))
      )}

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>Pending Requests</Text>
      {/* Pending Appointment Requests */}
      {pendingRequests.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>
              No pending appointment requests.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        pendingRequests.map((request) => (
          <Card key={request.id} style={styles.requestCard}>
            <Card.Content style={styles.cardContent}>
              <Avatar.Image size={50} source={request.avatar} />
              <View style={styles.infoContainer}>
                <Text style={styles.patientName}>{request.patientName}</Text>
                <Text style={styles.reason}>{request.reason}</Text>
                <Text style={styles.time}>{request.time}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Button
                  mode='contained'
                  style={styles.confirmButton}
                  onPress={() => handleConfirm(request.id)}
                >
                  Confirm
                </Button>
                <Button
                  mode='outlined'
                  style={styles.rejectButton}
                  onPress={() => handleReject(request.id)}
                >
                  Reject
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  emptyCard: {
    backgroundColor: colors.cardBackground,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
  },
  appointmentCard: {
    backgroundColor: colors.cardBackground,
    marginBottom: 10,
  },
  requestCard: {
    backgroundColor: colors.cardBackground,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  reason: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  confirmButton: {
    marginRight: 5,
    backgroundColor: colors.primary,
  },
  rejectButton: {
    borderColor: colors.primary,
  },
  divider: {
    marginVertical: 20,
  },
});
