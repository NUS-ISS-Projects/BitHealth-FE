import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import colors from "../theme/colors";

export default function Receipt() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Receipt</Text>
      <View style={styles.detailContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Consultation Fee:</Text>
          <Text style={styles.value}>$25.00</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Medication Fee:</Text>
          <Text style={styles.value}>$10.00</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>$35.00</Text>
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
    gap: 12,
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
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
});
