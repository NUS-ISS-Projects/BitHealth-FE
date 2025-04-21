import { API_URL } from "@/configs/config";
import { getAvatarSource } from "@/helper/avatarGenerator";
import { FontAwesome } from "@expo/vector-icons";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  Paragraph,
  Portal,
  Text,
} from "react-native-paper";
import colors from "../theme/colors";

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

const getData = async (key: string) => {
  if (Platform.OS === "web") {
    // Use localStorage for web
    return localStorage.getItem(key);
  } else {
    // Use expo-secure-store for mobile
    return await SecureStore.getItemAsync(key);
  }
};

export default function AppointmentDetails() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const { appointmentId } = route.params as { appointmentId: string };
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const token = await getData("authToken");
        if (!token) {
          console.error("No authentication token found.");
          setError(true);
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `${API_URL}/api/appointments/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointment(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setError(true);
        setLoading(false);
      }
    };
    fetchAppointmentDetails();
  }, [appointmentId]);

  const handleReschedule = () => {
    navigation.navigate("AppointmentDate", {
      isRescheduling: true,
      doctorName: appointment?.doctor.user.name,
      specialty: appointment?.doctor.specialty,
      appointmentId: appointment?.appointmentId,
      currentDate: appointment?.appointmentDate,
      currentTime: appointment?.appointmentTime,
    });
  };

  const handleDelete = () => {
    setDialogVisible(true);
  };

  const confirmCancel = async () => {
    try {
      const token = await getData("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
      const response = await axios.put(
        `${API_URL}/api/appointments/updateStatus/${appointmentId}`,
        { status: "CANCELLED" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load appointment details.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.headerBarContainer}>
          <IconButton
            mode='contained'
            icon='arrow-left'
            iconColor={colors.primary}
            containerColor='white'
            size={18}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerBar}>Appointment Details</Text>
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.doctorSection}>
              <Avatar.Image size={60} source={getAvatarSource(appointment)} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{appointment.doctor.user.name}</Text>
                <Text style={styles.specialty}>{appointment.doctor.specialty}</Text>
              </View>
              <StatusBadge status={appointment.status} />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.detailsSection}>
              <DetailRow
                icon='ticket'
                label='Appointment ID'
                value={appointment.appointmentId}
              />
              <DetailRow
                icon='calendar'
                label='Date'
                value={formatDate(appointment.appointmentDate)}
              />
              <DetailRow
                icon='clock-o'
                label='Time'
                value={formatTime(appointment.appointmentTime)}
              />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.reasonSection}>
              <View style={styles.reasonContent}>
                <Text style={styles.reasonLabel}>Reason for Visit</Text>
                <Text style={styles.reasonText}>{appointment.reasonForVisit}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        {(appointment.status === "PENDING" ||
          appointment.status === "CONFIRMED") && (
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

      {/* Dialog for Confirmation */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Cancel Appointment</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to cancel this appointment?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>No</Button>
            <Button onPress={confirmCancel}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});