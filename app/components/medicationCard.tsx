import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Chip } from "react-native-paper";
import colors from "../theme/colors";

export default function MedicationSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Medication</Text>
      <View style={styles.medicationItem}>
        <Text style={styles.medicationText}>Paracetamol</Text>
        <Text style={styles.medicationInstruction}>Instructions</Text>
        <Text style={styles.medicationInstructionText}>
          For headache, Take 1 tablet(s) Twice Daily for 3 days
        </Text>
      </View>
      <View style={styles.medicationItem}>
        <Text style={styles.medicationText}>Lozenges</Text>
        <Text style={styles.medicationInstruction}>Instructions</Text>
        <Text style={styles.medicationInstructionText}>
          For sore Throat, Take 1 tablet(s) Twice Daily for 3 days
        </Text>
      </View>
      <View style={styles.verifyContainer}>
        <Text style={styles.verifyText}>
          This mediciation is verified by BitHealth.
        </Text>
        <Chip
          mode='flat'
          style={[styles.approvedChip]}
          textStyle={styles.statusChipText}
        >
          Approved
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
});
