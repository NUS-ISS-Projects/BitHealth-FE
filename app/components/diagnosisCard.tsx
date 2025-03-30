import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import colors from "../theme/colors";
import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface DiagnosisSectionProps {
  appointmentId: number;
}

export default function DiagnosisSection({
  appointmentId,
}: DiagnosisSectionProps) {
  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisAction, setdiagnosisAction] = useState("");

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        const patientData = await fetchPatientSettings(appointmentId);
        setDiagnosis(patientData.diagnosis || "");
        setdiagnosisAction(patientData.diagnosisAction || "");
      } catch (error) {
        console.error("Failed to load patient data:", error);
      }
    };
    loadPatientData();
  }, []);

  async function fetchPatientSettings(appointmentId: number) {
    try {
      const response = await axios.get(
        `${API_URL}/api/appointments/diagnosis/${appointmentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to load patient data:", error);
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Diagnosis</Text>
      <Text style={styles.sectionTitle}>Your Diagnosis</Text>
      <Text style={styles.bodyText}>
        {diagnosis ? diagnosis : "No diagnosis available."}
      </Text>
      <Text style={styles.sectionTitle}>What You Should Do</Text>
      <Text style={styles.bodyText}>
        {diagnosisAction ? diagnosisAction : "You are good to go"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});
