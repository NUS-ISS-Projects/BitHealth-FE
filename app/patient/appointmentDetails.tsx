import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Avatar, IconButton, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../theme/colors";

interface DetailRowProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  value: string;
}

export default function AppointmentDetails() {
  const router = useRouter();

  const appointment = {
    doctorName: "Dr. Budi Sound",
    specialty: "General Practitioner",
    date: "21 May 2024",
    time: "10:00 AM",
    status: "Completed",
    bookingId: "BH-2024-001",
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
            <DetailRow icon='calendar' label='Date' value={appointment.date} />
            <DetailRow icon='clock-o' label='Time' value={appointment.time} />
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
    paddingLeft: 60,
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
});
