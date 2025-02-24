import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Avatar, Button, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import colors from "../theme/colors";
import { FontAwesome } from "@expo/vector-icons";

const mockConfirmedAppointments = [
  {
    id: 1,
    patientName: "Ferdi Klakson",
    date: "24 Feb 2025",
    time: "10:00 AM",
    reason: "General Checkup",
    avatar: require("../../assets/images/favicon.png"),
  },
  {
    id: 2,
    patientName: "Yuda Bukan Main",
    date: "24 Feb 2025",
    time: "11:30 AM",
    reason: "Follow-up",
    avatar: require("../../assets/images/favicon.png"),
  },
];

const mockPendingRequests = [
  {
    id: 3,
    patientName: "Alicia Keys",
    date: "24 Feb 2025",
    time: "2:00 PM",
    reason: "Skin Consultation",
    avatar: require("../../assets/images/favicon.png"),
  },
  {
    id: 4,
    patientName: "Bob Martin",
    date: "24 Feb 2025",
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const currentRequest = pendingRequests[currentIndex];

  const handleConfirm = (requestId: any) => {
    const request = pendingRequests.find((r) => r.id === requestId);
    if (request) {
      setConfirmedAppointments([...confirmedAppointments, request]);
      const newPending = pendingRequests.filter((r) => r.id !== requestId);
      setPendingRequests(newPending);
      if (currentIndex >= newPending.length) {
        setCurrentIndex(0);
      }
    }
  };

  const handleReject = (requestId: any) => {
    const newPending = pendingRequests.filter((r) => r.id !== requestId);
    setPendingRequests(newPending);
    if (currentIndex >= newPending.length) {
      setCurrentIndex(0);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeTxt}>Welcome Back!</Text>
        <Text style={styles.doctorName}>Dr. Budi Sound</Text>
      </View>

      <Text style={styles.sectionTitle}>Pending Requests</Text>
      {/* Pending Appointment Requests */}
      {pendingRequests.length === 0 || !currentRequest ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>
              No pending appointment requests.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.requestCard}>
          <Card.Content>
            <View style={styles.timeRangeContainer}>
              <Text style={styles.timeRangeText}>Appointment Request</Text>
              <View style={{ flexDirection: "row", paddingTop: 5 }}>
                <FontAwesome name='clock-o' size={24} color='#FFFFFF' />
                <Text style={styles.dateRangeValue}>
                  {currentRequest.date},{" "}
                </Text>
                <Text style={styles.timeRangeValue}>{currentRequest.time}</Text>
              </View>
            </View>
            <View style={styles.patientInfoContainer}>
              <Avatar.Image size={50} source={currentRequest.avatar} />
              <View style={styles.infoContainer}>
                <Text style={styles.patientName}>
                  {currentRequest.patientName}
                </Text>
                <Text style={styles.reason}>{currentRequest.reason}</Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <Button
                mode='contained'
                style={[styles.confirmButton, { flex: 0.6 }]}
                onPress={() => handleConfirm(currentRequest.id)}
              >
                Accept
              </Button>
              <Button
                mode='outlined'
                style={[styles.rejectButton, { flex: 0.4 }]}
                onPress={() => handleReject(currentRequest.id)}
                textColor='#123D1F'
              >
                Decline
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>Next appointments</Text>
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
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.date}>{appointment.date},</Text>
                  <Text style={styles.time}>{appointment.time}</Text>
                </View>
              </View>
              <Button
                mode='outlined'
                textColor='#123D1F'
                onPress={() =>
                  router.push(
                    `/doctor/prescription?appointmentId=${appointment.id}`
                  )
                }
              >
                View
              </Button>
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
    justifyContent: "space-between",
    marginBottom: 20,
  },
  welcomeTxt: {
    fontSize: 18,
    fontWeight: "regular",
    color: colors.textPrimary,
  },
  doctorName: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeRangeContainer: {
    backgroundColor: colors.primary,
    margin: -16,
    marginBottom: 16,
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  timeRangeText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
    opacity: 0.8,
  },
  dateRangeValue: {
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  timeRangeValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  patientInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
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
    color: colors.textPrimary,
    paddingVertical: 5,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  date: {
    marginRight: 2,
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
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
