import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Badge, Card, Text } from "react-native-paper";
import { formatDate, formatTime } from "../../helper/dateTimeFormatter";
import { getStatusColor } from "../../helper/statusColor";
import colors from "../theme/colors";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const getData = async (key: string) => {
  if (Platform.OS === "web") {
    // Use localStorage for web
    return localStorage.getItem(key);
  } else {
    // Use expo-secure-store for mobile
    return await SecureStore.getItemAsync(key);
  }
};
export default function DoctorAppointmentsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchAppointments = async () => {
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
    const { userId,name } = profileResponse.data; // Extract userId
      console.log("User ID:", userId);  
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/appointments/doctor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const handleCardPress = (appointment: any) => {
    navigation.navigate("Prescription", {
      appointmentId: appointment.appointmentId,
      userName: appointment.patient.user.name,
      patientUserId: appointment.patient.user.userId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      comment: appointment.comment,
      reasonForVisit: appointment.reasonForVisit,
      appointmentStatus: appointment.status,
    });
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
          onPress={() => handleCardPress(appointment)}
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
    paddingHorizontal: 20,
    width: 100,
    marginHorizontal: 10,
    color: "white",
  },
});
