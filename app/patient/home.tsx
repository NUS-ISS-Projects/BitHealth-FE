import React from "react";
import { View, Image, ScrollView, StyleSheet } from "react-native";
import { Text, Button, Card, Avatar } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import colors from "../theme/colors";

const appointments = [
  {
    name: "Dr. Budi Sound",
    location: "Komuk Express Semarang",
    date: "21 May",
    time: "10:00 AM",
    image: require("../../assets/images/favicon.png"),
  },
  {
    name: "Dr. Anastasia",
    location: "Komuk Express Bali",
    date: "17 May",
    time: "10:00 AM",
    image: require("../../assets/images/favicon.png"),
  },
];

const upcomingAppointments = [
  {
    name: "Dr. Eugene Huang",
    location: "Komuk Express Jakarta",
    date: "24 May",
    time: "10:00 AM",
    image: require("../../assets/images/favicon.png"),
    status: "Upcoming",
  },
];

export default function PatientHome() {
  const navigation = useNavigation<NavigationProp<any>>();
  const hasUpcoming = upcomingAppointments.length > 0;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/bithealth-logo.png")}
            style={styles.logo}
          />
          <Text variant='titleMedium' style={styles.title}>
            BitHealth
          </Text>
        </View>
        <View style={styles.greetingContainer}>
          <Text variant='titleSmall' style={styles.greetingText}>
            Hello,
          </Text>
          <Text variant='titleLarge' style={styles.userName}>
            Jong Yann! 👋
          </Text>
        </View>
        {hasUpcoming ? (
          <>
            <View style={styles.sectionHeader}>
              <Text variant='titleMedium' style={styles.sectionTitle}>
                Upcoming Appointments
              </Text>
            </View>
            {upcomingAppointments.map((appointment, index) => (
              <Card
                key={index}
                style={styles.appointmentCard}
                onPress={() => navigation.navigate("AppointmentDetails")}
              >
                <Card.Content style={styles.appointmentCardContent}>
                  <Avatar.Image size={50} source={appointment.image} />
                  <View style={styles.appointmentDetails}>
                    <View style={styles.appointmentHeader}>
                      <Text variant='titleSmall' style={styles.doctorName}>
                        {appointment.name}
                      </Text>
                    </View>
                    <Text
                      variant='bodySmall'
                      style={styles.appointmentLocation}
                    >
                      {appointment.location}
                    </Text>
                    <View style={styles.timeContainer}>
                      <Text
                        variant='labelMedium'
                        style={styles.appointmentDate}
                      >
                        {appointment.date}, {appointment.time}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
            <Button
              mode='contained'
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
              <Text variant='titleMedium' style={styles.bookingTitle}>
                No booking schedule
              </Text>
              <Text variant='bodyMedium' style={styles.bookingDescription}>
                Seems like you do not have any appointment scheduled today.
              </Text>
              <View>
                <Button
                  mode='contained'
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
          <Text variant='titleMedium' style={styles.sectionTitle}>
            Recent Appointments
          </Text>
        </View>

        {appointments.map((appointment, index) => (
          <Card
            key={index}
            style={styles.appointmentCard}
            onPress={() => navigation.navigate("AppointmentDetails")}
          >
            <Card.Content style={styles.appointmentCardContent}>
              <Avatar.Image size={50} source={appointment.image} />
              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentHeader}>
                  <Text variant='titleSmall' style={styles.doctorName}>
                    {appointment.name}
                  </Text>
                </View>
                <Text variant='bodySmall' style={styles.appointmentLocation}>
                  {appointment.location}
                </Text>
                <Text variant='labelMedium' style={styles.appointmentDate}>
                  {appointment.date}, {appointment.time}
                </Text>
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
  appointmentLocation: {
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
});
