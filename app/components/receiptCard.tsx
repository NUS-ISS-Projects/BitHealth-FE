import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import colors from "../theme/colors";
import axios from "axios";
import { API_URL } from "@/configs/config";

interface ReceiptSectionProps {
  appointmentId: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Receipt({ appointmentId }: ReceiptSectionProps) {
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
      <Text style={styles.sectionHeading}>Receipt</Text>
      <View style={styles.detailContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Invoice No.:</Text>
          <Text style={styles.value}>{medicationData.invoiceNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Invoice Date:</Text>
          <Text style={styles.value}>
            {formatDate(medicationData.invoiceDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Consultation Fee:</Text>
          <Text style={styles.value}>$25.00</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Medication Fee:</Text>
          <Text style={styles.value}>$100.00</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>$125.00</Text>
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
  loadingContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
