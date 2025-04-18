import { FontAwesome } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Divider, Text } from "react-native-paper";
import { getAvatarSource } from "../../helper/avatarGenerator";
import { formatDate, formatTime } from "../../helper/dateTimeFormatter";
import colors from "../theme/colors";
import { API_URL } from "@/configs/config";

const getData = async (key: string) => {
  if (Platform.OS === "web") {
    // Use localStorage for web
    return localStorage.getItem(key);
  } else {
    // Use expo-secure-store for mobile
    return await SecureStore.getItemAsync(key);
  }
};
export default function DoctorDashboard() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [confirmedAppointments, setConfirmedAppointments] = useState<any[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentRequest = pendingAppointments[currentIndex];
  const [userName, setUserName] = useState("");

  const updateAppointmentStatus = async (requestId: any, newStatus: string) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/appointments/updateStatus/${requestId}`,
        { status: newStatus }
      );

      if (response.status === 200) {
        const request = pendingAppointments.find(
          (r: any) => r.id === requestId
        );
        if (request) {
          setConfirmedAppointments([...confirmedAppointments, request]);
          const newPending = pendingAppointments.filter(
            (r: any) => r.id !== requestId
          );
          setPendingAppointments(newPending);
          if (currentIndex >= newPending.length) {
            setCurrentIndex(0);
          }
        }
        await fetchAppointments();
      }
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  };
  const fetchAppointments = async () => {
    try {
      const token = await getData("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
      // Fetch doctor profile
      const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { userId, name } = profileResponse.data;
      const response = await axios.get(`${API_URL}/api/appointments/doctor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setUserName(name);
      const pending = data.filter((apt: any) => apt.status === "PENDING");
      const confirmed = data.filter((apt: any) => apt.status == "CONFIRMED");
      setPendingAppointments(pending);
      setConfirmedAppointments(confirmed);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeTxt}>Welcome Back!</Text>
        <Text style={styles.doctorName}>Dr. {userName}</Text>
      </View>

      <Text style={styles.sectionTitle}>Pending Requests</Text>
      {/* Pending Appointment Requests */}
      {pendingAppointments.length === 0 || !currentRequest ? (
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
                  {formatDate(currentRequest.appointmentDate)},{" "}
                </Text>
                <Text style={styles.timeRangeValue}>
                  {formatTime(currentRequest.appointmentTime)}
                </Text>
              </View>
            </View>
            <View style={styles.patientInfoContainer}>
              <Avatar.Image
                size={50}
                source={getAvatarSource({
                  id: currentRequest.patient.user.userId,
                  image: "",
                })}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.patientName}>
                  {currentRequest.patient.user.name}
                </Text>
                <Text style={styles.reason}>
                  {currentRequest.reasonForVisit}
                </Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <Button
                mode='contained'
                style={[styles.confirmButton, { flex: 0.6 }]}
                onPress={() =>
                  updateAppointmentStatus(
                    currentRequest.appointmentId,
                    "CONFIRMED"
                  )
                }
                textColor='#FFFFFF'
              >
                Accept
              </Button>
              <Button
                mode='outlined'
                style={[styles.rejectButton, { flex: 0.4 }]}
                onPress={() =>
                  updateAppointmentStatus(
                    currentRequest.appointmentId,
                    "REJECTED"
                  )
                }
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
          <Card key={appointment.appointmentId} style={styles.appointmentCard}>
            <Card.Content style={styles.cardContent}>
              <Avatar.Image
                size={50}
                source={getAvatarSource({
                  id: appointment.patient.user.userId,
                  image: "",
                })}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.patientName}>
                  {appointment.patient.user.name}
                </Text>
                <Text style={styles.reason}>{appointment.reasonForVisit}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.date}>
                    {formatDate(appointment.appointmentDate)},
                  </Text>
                  <Text style={styles.time}>
                    {formatTime(appointment.appointmentTime)}
                  </Text>
                </View>
              </View>
              <Button
                mode='outlined'
                textColor='#123D1F'
                onPress={() =>
                  navigation.navigate("Prescription", {
                    appointmentId: appointment.appointmentId,
                    userName: appointment.patient.user.name,
                    patientUserId: appointment.patient.user.userId,
                    appointmentDate: appointment.appointmentDate,
                    appointmentTime: appointment.appointmentTime,
                    comment: appointment.comment,
                    reasonForVisit: appointment.reasonForVisit,
                  })
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
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 12,
    color: colors.textSecondary,
  },
  date: {
    marginRight: 2,
    fontSize: 12,
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
