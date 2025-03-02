import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Avatar,
  Card,
  Badge,
  IconButton,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "../theme/colors";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function ConfirmAppointment() {
  const {
    doctor,
    date = "July 4, 2024",
    location = "Komuk Express Semarang",
    time = "09:00",
  } = useLocalSearchParams();
  const navigation = useNavigation<NavigationProp<any>>();

  const handleBooking = () => {
    navigation.navigate("Confirmed");
  };

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
                {doctor || "Dr. Budi Sound"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.specialty}>Aesthetic Doctor</Text>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.rating}>⭐ 5.0 (780)</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Date and Location */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>📅 Date</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <View style={styles.locationRow}>
              <Text style={styles.label}>📍 Location</Text>
              <Text style={[styles.value]}>{location}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.directions}>Directions</Text>
            </View>
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
        Book now
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
  rating: {
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
  locationRow: {
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
