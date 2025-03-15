import React from "react";
import axios from "axios";
import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  Avatar,
  IconButton,
  Divider,
  Button,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../theme/colors";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Alert } from "react-native";
// import { API_URL } from "@env";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface DetailRowProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  value: string;
}

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

export default function AppointmentDetails() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<any>>();
  const [isLoading, setIsLoading] = useState(false);

  const handleReschedule = () => {
    navigation.navigate("AppointmentDate", {
      isRescheduling: true,
      doctorName: appointment.doctorName,
      specialty: appointment.specialty,
      appointmentId: appointment.bookingId,
      currentDate: appointment.date,
      currentTime: appointment.time,
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await axios.put(
                `${API_URL}/api/appointments/updateStatus/4`,
                { status: "CANCELLED" }
              );

              if (response.status === 200) {
                navigation.goBack();
              }
            } catch (error) {
              console.error("Failed to cancel appointment:", error);
              Alert.alert(
                "Error",
                "Failed to cancel appointment. Please try again."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const appointment = {
    doctorName: "Dr. Budi Sound",
    specialty: "General Practitioner",
    date: "2025-05-21",
    time: "23:13",
    status: "Pending",
    bookingId: "6",
    image: require("../../assets/images/favicon.png"),
    reason: "I am down with a fever",
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case "Completed":
          return "#4CAF50";
        case "Upcoming":
          return colors.primary;
        case "Cancelled":
          return "#DC3545";
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
      <View style={styles.headerBarContainer}>
        <IconButton
          mode='contained'
          icon='arrow-left'
          iconColor={colors.primary}
          containerColor='white'
          size={18}
          onPress={() => router.back()}
        />
        <Text style={styles.headerBar}>Appointment Details</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.doctorSection}>
            <Avatar.Image size={60} source={appointment.image} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{appointment.doctorName}</Text>
              <Text style={styles.specialty}>{appointment.specialty}</Text>
            </View>
            <StatusBadge status={appointment.status} />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailsSection}>
            <DetailRow
              icon='ticket'
              label='Appointment ID'
              value={appointment.bookingId}
            />
            <DetailRow
              icon='calendar'
              label='Date'
              value={formatDate(appointment.date)}
            />
            <DetailRow
              icon='clock-o'
              label='Time'
              value={formatTime(appointment.time)}
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.reasonSection}>
            <View style={styles.reasonContent}>
              <Text style={styles.reasonLabel}>Reason for Visit</Text>
              <Text style={styles.reasonText}>{appointment.reason}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      {(appointment.status === "Pending" ||
        appointment.status === "Confirmed") && (
        <View style={styles.actionButtons}>
          <Button
            mode='outlined'
            icon='calendar'
            onPress={handleReschedule}
            style={styles.rescheduleButton}
            labelStyle={styles.rescheduleButtonLabel}
          >
            Reschedule Appointment
          </Button>
          <Button
            mode='contained'
            icon='delete'
            onPress={handleDelete}
            style={styles.deleteButton}
            labelStyle={styles.deleteButtonLabel}
          >
            Cancel Appointment
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.labelContainer}>
      <FontAwesome name={icon} size={16} color={colors.textSecondary} />
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  headerBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerBar: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
    paddingLeft: 50,
  },
  card: {
    backgroundColor: colors.cardBackground,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  reasonSection: {
    marginTop: 10,
  },
  reasonContent: {
    gap: 8,
  },
  reasonLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  reasonText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  doctorSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  doctorInfo: {
    marginLeft: 15,
    justifyContent: "center",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    marginVertical: 15,
  },
  detailsSection: {
    gap: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
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
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  actionButtons: {
    gap: 15,
    marginTop: 10,
  },
  rescheduleButton: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  rescheduleButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#DC3545",
  },
  deleteButtonLabel: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
