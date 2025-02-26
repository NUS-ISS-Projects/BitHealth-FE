import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  Chip,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import colors from "../theme/colors";

export default function MedicalCertificateScreen() {
  const { appointmentId } = useLocalSearchParams();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [mc, setMC] = useState("");
  const [name, setName] = useState("");
  const [id, setID] = useState("");
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("Pending");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleSave = () => {
    setLastUpdated(new Date());
  };

  const handleApprove = () => {
    setStatus("Approved");
    setLastUpdated(new Date());
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
          onPress={() => router.back()}
        />
        <Text style={styles.headerBar}>Upload Medical Certificate</Text>
      </View>
      <View style={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label='Date of Visit'
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
            <TextInput
              label='MC No.'
              value={mc}
              onChangeText={setMC}
              style={styles.input}
            />
            <TextInput
              label='Name'
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              label='NRIC'
              value={id}
              onChangeText={setID}
              style={styles.input}
            />
            <TextInput
              label='Reason'
              multiline
              numberOfLines={5}
              value={reason}
              onChangeText={setReason}
              style={[styles.input, styles.multilineInput]}
            />
            <TextInput
              label='Remarks'
              multiline
              numberOfLines={5}
              value={remarks}
              onChangeText={setRemarks}
              style={[styles.input, styles.multilineInput]}
            />

            <View style={styles.statusContainer}>
              <Chip
                mode='flat'
                style={[
                  styles.statusChip,
                  status === "Approved"
                    ? styles.approvedChip
                    : styles.pendingChip,
                ]}
                textStyle={styles.statusChipText}
              >
                {status}
              </Chip>
              {lastUpdated && (
                <Text style={styles.lastUpdatedText}>
                  Last Updated: {lastUpdated.toLocaleString()}
                </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode='contained'
                style={[styles.button, styles.approveButton]}
                labelStyle={styles.buttonText}
                onPress={handleApprove}
              >
                Approve
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    paddingLeft: 30,
  },
  contentContainer: {
    paddingBottom: 40,
    flex: 1,
  },
  card: {
    padding: 15,
    backgroundColor: colors.cardBackground,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    flex: 1,
    marginRight: 10,
  },
  approveButton: {
    backgroundColor: colors.accent,
    marginRight: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statusContainer: {
    marginVertical: 20,
    alignItems: "flex-start",
  },
  statusChip: {
    marginBottom: 8,
  },
  approvedChip: {
    backgroundColor: colors.accent,
  },
  pendingChip: {
    backgroundColor: "#DC3545",
  },
  statusChipText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  lastUpdatedText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
