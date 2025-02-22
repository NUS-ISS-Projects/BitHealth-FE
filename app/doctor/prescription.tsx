import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import colors from "../theme/colors";

export default function PrescriptionScreen() {
  const {
    appointmentId,
    patientName = "John Doe",
    patientAge = "35",
    patientDetails = "This patient has been experiencing mild symptoms. Further details will be added here.",
  } = useLocalSearchParams();

  const router = useRouter();

  const handleMedicalCertificate = () => {
    router.push(`/doctor/medical-certificate?appointmentId=${appointmentId}`);
  };

  const handlePrescription = () => {
    router.push(`/doctor/prescription-details?appointmentId=${appointmentId}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Patient Details Card */}
      <Card style={styles.card}>
        <Card.Title
          title={patientName}
          subtitle={`Age: ${patientAge}`}
          left={(props) => (
            <Card.Cover
              {...props}
              source={require("../../assets/images/favicon.png")}
              style={styles.avatar}
            />
          )}
        />
        <Card.Content>
          <Text style={styles.detailsText}>{patientDetails}</Text>
        </Card.Content>
      </Card>

      {/* Buttons to upload documents */}
      <View style={styles.buttonsContainer}>
        <Button
          mode='contained'
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={handleMedicalCertificate}
        >
          Upload Medical Certificate
        </Button>
        <Button
          mode='contained'
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={handlePrescription}
        >
          Upload Prescription
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // e.g., "#F5F2EC"
    padding: 20,
  },
  card: {
    marginBottom: 20,
    backgroundColor: colors.cardBackground, // e.g., white
  },
  avatar: {
    width: 50,
    height: 50,
  },
  detailsText: {
    fontSize: 16,
    color: colors.textPrimary, // e.g., dark gray
  },
  buttonsContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary, // your green primary color
    borderRadius: 50,
    paddingVertical: 10,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
