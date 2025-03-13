import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Chip } from "react-native-paper";
import colors from "../theme/colors";

export default function MedicalCertificate() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Medical Certificate</Text>
      <View style={styles.detailContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>Jong</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Visit Date:</Text>
          <Text style={styles.value}>17 March 2025</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Doctor</Text>
          <Text style={styles.value}>Dr Eugene Huang</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Certificate No.:</Text>
          <Text style={styles.value}>MC123456</Text>
        </View>
        <View style={styles.unfitContainer}>
          <Text style={styles.unfitText}>
            The above mentioned individual has been certified unfit for duty for
            1 day with effect from 17 Dec 2025
          </Text>
        </View>
        <View style={styles.verifyContainer}>
          <Text style={styles.verifyText}>
            This medical certificate is verified by BitHealth.
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  detailContainer: {
    gap: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  unfitContainer: {
    paddingVertical: 10,
  },
  unfitText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "bold",
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
