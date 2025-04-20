import { API_URL } from "@/configs/config";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { isAfter, isBefore, isEqual, parseISO } from "date-fns";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { getAvatarSource } from "../../helper/avatarGenerator";
import { formatDate, formatTime } from "../../helper/dateTimeFormatter";
import colors from "../theme/colors";

const getData = async (key: string) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export default function PatientHome() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const token = await getData("authToken");
        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        // Fetch patient profile
        const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name } = profileResponse.data;
        setUserName(name);

        // Fetch appointments
        const appointmentsResponse = await axios.get(
          `${API_URL}/api/appointments/patient`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = appointmentsResponse.data;

        // Get current date and time
        const now = new Date();

        // Helper function to parse appointment date and time
        const parseAppointmentDateTime = (appointment: any) => {
          const date = parseISO(appointment.appointmentDate);
          const timeParts = appointment.appointmentTime.split(":").map(Number);
          return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            timeParts[0], // Hours
            timeParts[1] // Minutes
          );
        };

        // Filter appointments
        const upcoming = data.filter((apt: any) => {
          const appointmentDateTime = parseAppointmentDateTime(apt);
          return (
            isAfter(appointmentDateTime, now) ||
            (isEqual(appointmentDateTime, now) &&
              (apt.status === "PENDING" || apt.status === "CONFIRMED"))
          );
        });

        const recent = data.filter((apt: any) => {
          const appointmentDateTime = parseAppointmentDateTime(apt);
          return isBefore(appointmentDateTime, now);
        });

        setUpcomingAppointments(upcoming);
        setRecentAppointments(recent);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchAppointments();
  }, []);

  const hasUpcoming = upcomingAppointments.length > 0;

  // StatusBadge Component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case "Completed":
          return "#4CAF50";
        case "Upcoming":
          return colors.primary;
        case "Cancelled":
          return "#757575";
        default:
          return "#757575";
      }
    };

    return (
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/bithealth-logo.png")}
            style={styles.logo}
          />
          <Text variant="titleMedium" style={styles.title}>
            BitHealth
          </Text>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text variant="titleSmall" style={styles.greetingText}>
            Hello,
          </Text>
          <Text variant="titleLarge" style={styles.userName}>
            {userName} 👋
          </Text>
        </View>

        {/* Upcoming Appointments */}
        {hasUpcoming ? (
          <>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Upcoming Appointments
              </Text>
            </View>
            {upcomingAppointments.map((appointment, index) => (
              <Card
                key={index}
                style={styles.appointmentCard}
                onPress={() =>
                  navigation.navigate("AppointmentDetails", {
                    appointmentId: appointment.appointmentId,
                  })
                }
              >
                <Card.Content style={styles.appointmentCardContent}>
                  <Avatar.Image
                    size={50}
                    source={getAvatarSource(appointment)}
                  />
                  <View style={styles.appointmentDetails}>
                    <View style={styles.appointmentHeader}>
                      <Text variant="titleSmall" style={styles.doctorName}>
                        {appointment.doctor.user.name}
                      </Text>
                    </View>
                    <Text
                      variant="bodySmall"
                      style={styles.appointmentReason}
                    >
                      {appointment.reasonForVisit}
                    </Text>
                    <View style={styles.timeContainer}>
                      <Text
                        variant="labelMedium"
                        style={styles.appointmentDate}
                      >
                        {formatDate(appointment.appointmentDate)},{" "}
                        {formatTime(appointment.appointmentTime)}
                      </Text>
                    </View>
                  </View>
                  {/* Status Badge */}
                  <View style={styles.statusContainer}>
                    <StatusBadge status={appointment.status} />
                  </View>
                </Card.Content>
              </Card>
            ))}
            <Button
              mode="contained"
              style={styles.bookButton}
              labelStyle={{ color: "white" }}
              onPress={() => navigation.navigate("Reason")}
            >
              Make a new appointment
            </Button>
          </>
        ) : (
          <Card style={styles.bookingCard}>
            <Card.Content style={styles.bookingCardContent}>
              <Image
                source={require("../../assets/images/patient-home.png")}
                style={styles.bookingImage}
              />
              <Text variant="titleMedium" style={styles.bookingTitle}>
                No booking schedule
              </Text>
              <Text variant="bodyMedium" style={styles.bookingDescription}>
                Seems like you do not have any appointment scheduled today.
              </Text>
              <View>
                <Button
                  mode="contained"
                  style={styles.bookButton}
                  labelStyle={{ color: "white" }}
                  onPress={() => navigation.navigate("Reason")}
                >
                  Make appointment
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Recent Appointments */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Appointments
          </Text>
        </View>
        {recentAppointments.map((appointment, index) => (
          <Card
            key={index}
            style={styles.appointmentCard}
            onPress={() =>
              navigation.navigate("AppointmentDetails", {
                appointmentId: appointment.appointmentId,
              })
            }
          >
            <Card.Content style={styles.appointmentCardContent}>
              <Avatar.Image size={50} source={getAvatarSource(appointment)} />
              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentHeader}>
                  <Text variant="titleSmall" style={styles.doctorName}>
                    {appointment.doctor.user.name}
                  </Text>
                </View>
                <Text variant="bodySmall" style={styles.appointmentReason}>
                  {appointment.reasonForVisit}
                </Text>
                <View style={styles.timeContainer}>
                  <Text variant="labelMedium" style={styles.appointmentDate}>
                    {formatDate(appointment.appointmentDate)},{" "}
                    {formatTime(appointment.appointmentTime)}
                  </Text>
                </View>
              </View>
              {/* Status Badge */}
              <View style={styles.statusContainer}>
                <StatusBadge status={appointment.status} />
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  contentWrapper: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontWeight: "bold",
    color: "black",
  },
  greetingContainer: {
    paddingBottom: 20,
    paddingLeft: 10,
  },
  greetingText: {
    fontWeight: "bold",
    color: "grey",
  },
  userName: {
    fontWeight: "bold",
    color: colors.primary,
  },
  bookingCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    paddingVertical: 20,
  },
  bookingCardContent: {
    alignItems: "center",
  },
  bookingImage: {
    width: 300,
    height: 200,
  },
  bookingTitle: {
    fontWeight: "bold",
    color: colors.primary,
    paddingBottom: 10,
  },
  bookingDescription: {
    color: colors.textSecondary,
    textAlign: "center",
    paddingBottom: 10,
  },
  bookButton: {
    marginTop: 15,
    backgroundColor: colors.primary,
  },
  sectionHeader: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  appointmentCard: {
    backgroundColor: colors.cardBackground,
    padding: 10,
    marginBottom: 10,
  },
  appointmentCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentDetails: {
    marginLeft: 15,
    flex: 1,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  doctorName: {
    fontWeight: "bold",
    color: colors.primary,
  },
  appointmentDate: {
    color: colors.primary,
  },
  appointmentReason: {
    color: colors.textSecondary,
    paddingTop: 5,
  },
  timeContainer: {
    paddingTop: 5,
    flexDirection: "row",
  },
  appointmentTime: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statusContainer: {
    marginTop: 10,
    alignItems: "flex-end", // Align the badge to the right-bottom corner
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});