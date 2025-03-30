import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Chip } from "react-native-paper";
import colors from "../theme/colors";
import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface MedicationSectionProps {
  appointmentId: number;
}

export default function MedicationSection({
  appointmentId,
}: MedicationSectionProps) {
  const [medicationData, setMedicationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchMedication(appointmentId: number) {
      try {
        const response = await axios.get(
          `${API_URL}/api/prescriptions/appointment/${appointmentId}`
        );
        setMedicationData(response.data);
      } catch (error) {
        console.error("Error fetching medication data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMedication(appointmentId);
  }, [appointmentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    );
  }

  if (!medicationData) {
    return <Text>Error loading medication data.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Medication</Text>
      {medicationData.medicineList.map((medicine: any, index: number) => (
        <View key={index} style={styles.medicationItem}>
          <Text style={styles.medicationText}>{medicine.medicineName}</Text>
          <Text style={styles.medicationInstruction}>Instructions</Text>
          <Text style={styles.medicationInstructionText}>
            For {medicine.purpose}, Take {medicine.dosage} for{" "}
            {medicine.duration}. {medicine.notes}
          </Text>
        </View>
      ))}
      <View style={styles.verifyContainer}>
        <Text style={styles.verifyText}>
          This mediciation is verified by BitHealth.
        </Text>
        <Chip
          mode='flat'
          style={
            medicationData.isVerified ? styles.approvedChip : styles.pendingChip
          }
          textStyle={styles.statusChipText}
        >
          {medicationData.isVerified ? "Approved" : "Not Approved"}
        </Chip>
      </View>
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
  medicationItem: {
    marginBottom: 15,
  },
  medicationInstruction: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  medicationInstructionText: {
    fontSize: 14,
    color: "Black",
  },
  medicationText: {
    flex: 1,
    color: "Black",
    fontWeight: "bold",
    fontSize: 18,
  },
  verifyContainer: {
    backgroundColor: "#F5F2EC",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  verifyText: {
    fontSize: 10,
    color: "black",
  },
  statusChipText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  approvedChip: {
    backgroundColor: colors.accent,
    marginTop: 8,
  },
  pendingChip: {
    backgroundColor: "#DC3545",
    marginTop: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
