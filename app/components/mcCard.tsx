import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import axios from "axios";
import colors from "../theme/colors";
import { API_URL } from "@/configs/config";

interface MedicalCertificateProps {
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

export default function MedicalCertificate({
  appointmentId,
}: MedicalCertificateProps) {
  const [certificateData, setCertificateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    async function fetchCertificate() {
      try {
        const response = await axios.get(
          `${API_URL}/api/medical-certificates/appointment/${appointmentId}`
        );
        if (response.data) {
          setCertificateData(response.data);
        } else {
          setErrorMsg("No certificate data found.");
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
        setErrorMsg("Error fetching certificate data.");
      } finally {
        setLoading(false);
      }
    }
    fetchCertificate();
  }, [appointmentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    );
  }

  if (!certificateData) {
    return (
      <View style={styles.errorContainer}>
        <Text>{errorMsg || "Certificate data not available."}</Text>
      </View>
    );
  }

  // Destructure the certificate data safely now
  const {
    certificateNumber,
    issueDate,
    noOfDays,
    effectFrom,
    isVerified,
    appointment,
  } = certificateData;

  const patientName = appointment?.patient?.user?.name || "Unknown Patient";
  const doctorName = appointment?.doctor?.user?.name || "Unknown Doctor";
  const visitDate = appointment?.appointmentDate || "Unknown Date";

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Medical Certificate</Text>
      <View style={styles.detailContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{patientName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Visit Date:</Text>
          <Text style={styles.value}>{formatDate(visitDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Doctor</Text>
          <Text style={styles.value}>{doctorName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Certificate No.:</Text>
          <Text style={styles.value}>{certificateNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Issue Date:</Text>
          <Text style={styles.value}>{formatDate(issueDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>No. of Days:</Text>
          <Text style={styles.value}>{noOfDays} Days</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Effective From:</Text>
          <Text style={styles.value}>{formatDate(effectFrom)}</Text>
        </View>
        <View style={styles.unfitContainer}>
          <Text style={styles.unfitText}>
            The above mentioned individual has been certified unfit for duty for{" "}
            {noOfDays} day(s) with effect from {formatDate(effectFrom)}.
          </Text>
        </View>
        <View style={styles.verifyContainer}>
          <Text style={styles.verifyText}>
            {isVerified
              ? "This medical certificate is verified by BitHealth."
              : "This medical certificate has not been verified by BitHealth."}
          </Text>
          <Chip
            mode='flat'
            style={isVerified ? styles.approvedChip : styles.pendingChip}
            textStyle={styles.statusChipText}
          >
            {isVerified ? "Approved" : "Not Approved"}
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
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  unfitContainer: {
    paddingVertical: 10,
  },
  unfitText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  verifyContainer: {
    backgroundColor: "#F5F2EC",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 16,
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
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
