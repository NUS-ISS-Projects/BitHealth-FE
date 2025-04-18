import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Badge,
  Button,
  Card,
  IconButton,
  Text,
} from "react-native-paper";
import colors from "../theme/colors";
import { API_URL } from "@/configs/config";

type AppointmentParams = {
  doctorId: number;
  doctorName: string;
  specialty: string;
  reason?: string;
  checkupType?: string;
  appointmentDate: string;
  appointmentTime: string;
  isRescheduling: boolean;
  appointmentId?: string;
};

const getData = async (key: string) => {
  if (Platform.OS === "web") {
    // Use localStorage for web
    return localStorage.getItem(key);
  } else {
    // Use expo-secure-store for mobile
    return await SecureStore.getItemAsync(key);
  }
};

export default function ConfirmAppointment() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const {
    doctorId,
    doctorName,
    specialty,
    reason,
    checkupType,
    appointmentDate,
    appointmentTime,
    isRescheduling,
    appointmentId,
  } = route.params as AppointmentParams;

  // State variables
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);

  // Fetch token and user profile on component mount
  useEffect(() => {
    const fetchTokenAndProfile = async () => {
      try {
        const authToken = await getData("authToken");
        if (!authToken) {
          console.error("No authentication token found.");
          return;
        }
        setToken(authToken);

        // Fetch user profile
        const profileResponse = await axios.get(
          `${API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        // Extract userId
        const { userId } = profileResponse.data;
        setUserId(userId);

        // Fetch patient profile
        const patientProfileResponse = await axios.get(
          `${API_URL}/api/patients/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const { patientId } = patientProfileResponse.data;
        setPatientId(patientId);
      } catch (error) {
        console.error("Failed to fetch token or profile:", error);
      }
    };

    fetchTokenAndProfile();
  }, []);

  const handleBooking = async () => {
    if (!token || !patientId) {
      console.error("Missing token or patientId.");
      return;
    }

    if (isRescheduling && appointmentId) {
      try {
        const rescheduleData = {
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
        };
        const response = await axios.put(
          `${API_URL}/api/appointments/reschedule/${appointmentId}`,
          rescheduleData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          navigation.navigate("Confirmed", {
            doctorName,
            appointmentDate,
            appointmentTime,
            isRescheduling: true,
          });
        }
      } catch (error) {
        console.error("Failed to reschedule appointment:", error);
      }
    } else if (doctorId && appointmentDate && appointmentTime) {
      try {
        const appointmentData = {
          patientId: patientId,
          doctorId: doctorId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason_for_visit: checkupType,
          comment: reason || "",
        };
        const response = await axios.post(
          `${API_URL}/api/appointments`,
          appointmentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          navigation.navigate("Confirmed", {
            doctorName,
            appointmentDate,
            appointmentTime,
            isRescheduling: false,
          });
        }
      } catch (error) {
        console.error("Failed to book appointment:", error);
      }
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes.slice(0, 2)} ${ampm}`;
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  if (!token || !userId || !patientId) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBarContainer}>
        <IconButton
          mode='contained'
          icon='arrow-left'
          iconColor='#123D1F'
          containerColor='white'
          size={18}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerBar}>Confirm Date</Text>
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Is everything</Text>
          <Text style={styles.header}>correct?</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>4/4</Text>
        </View>
      </View>

      {/* Confirmation Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmTitle}>Confirm appointment</Text>
            <Badge style={styles.pendingBadge}>Pending</Badge>
          </View>

          {/* Doctor Info */}
          <View style={styles.doctorContainer}>
            <Avatar.Image
              size={50}
              source={require("../../assets/images/favicon.png")}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>
                {doctorName || "Dr. Budi Sound"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.specialty}>{specialty}</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Date and Time */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>📅 Date</Text>
            <Text style={styles.value}>{formatDate(appointmentDate)}</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <View style={styles.TimeRow}>
              <Text style={styles.label}>🕙 Time</Text>
              <Text style={[styles.value]}>{formatTime(appointmentTime)}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}></View>
          </View>
        </Card.Content>
      </Card>

      {/* Book Now Button */}
      <Button
        mode='contained'
        style={styles.bookButton}
        labelStyle={styles.bookButtonText}
        onPress={handleBooking}
      >
        {isRescheduling ? "Reschedule now" : "Book now"}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EC",
    padding: 20,
  },
  headerBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  headerBar: {
    fontSize: 15,
    fontWeight: "regular",
    color: colors.primary,
    paddingLeft: 85,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressContainer: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  confirmTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  pendingBadge: {
    backgroundColor: "#FBE8E7",
    color: "#D9534F",
    fontSize: 14,
    fontWeight: "bold",
  },
  doctorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  doctorInfo: {
    paddingLeft: 15,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  specialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dot: {
    fontSize: 15,
    color: colors.textSecondary,
    paddingHorizontal: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 5,
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textSecondary,
  },
  value: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  TimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  directions: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
