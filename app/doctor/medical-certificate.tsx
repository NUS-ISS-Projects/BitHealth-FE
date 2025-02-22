import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import colors from "../theme/colors";

export default function MedicalCertificateScreen() {
  const { appointmentId } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("Pending");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleSave = () => {
    setLastUpdated(new Date());
    // Add your save logic here (e.g., API call)
  };

  const handleApprove = () => {
    setStatus("Approved");
    setLastUpdated(new Date());
    // Add your approval logic here (e.g., API call)
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Upload Medical Certificate</Text>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label='Document Title'
            mode='outlined'
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            label='Certificate Details'
            mode='outlined'
            multiline
            numberOfLines={4}
            value={details}
            onChangeText={setDetails}
            style={styles.input}
          />

          <View style={styles.statusContainer}>
            <Text>Status: {status}</Text>
            {lastUpdated && (
              <Text>Last Updated: {lastUpdated.toLocaleString()}</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode='contained'
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={handleSave}
            >
              Save
            </Button>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // e.g., soft beige
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  card: {
    padding: 15,
    backgroundColor: colors.cardBackground, // white or similar
  },
  input: {
    marginBottom: 15,
  },
  statusContainer: {
    marginVertical: 10,
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
});
