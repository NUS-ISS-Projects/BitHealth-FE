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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import colors from "../theme/colors";

const formFields = [
  { label: "Date of Visit", field: "dateOfVisit" },
  { label: "MC No.", field: "mcNo" },
  { label: "Name", field: "name" },
  { label: "No. of Days", field: "noOfDays" },
  { label: "With Effect From", field: "effectiveFrom" },
];

export default function PatientDiagnosisScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [formData, setFormData] = useState({
    dateOfVisit: "",
    mcNo: "",
    name: "",
    noOfDays: "",
    effectiveFrom: "",
  });
  const [status, setStatus] = useState("Pending");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [diagnosis, setDiagnosis] = useState("");

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApprove = () => {
    setStatus("Approved");
    setLastUpdated(new Date());
  };

  const handleSave = () => {
    // Add save logic here
    navigation.goBack();
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
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerBar}>Enter Patient Diagnosis</Text>
      </View>
      <View style={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Please provide a diagnosis of the patient's condition
            </Text>
            <TextInput
              value={diagnosis}
              onChangeText={setDiagnosis}
              mode='outlined'
              multiline
              numberOfLines={8}
              style={styles.diagnosisInput}
              theme={{
                colors: {
                  primary: colors.primary,
                },
              }}
            />
            <View style={styles.buttonContainer}>
              <Button
                mode='contained'
                style={styles.saveButton}
                labelStyle={styles.buttonText}
                onPress={handleSave}
              >
                Save Diagnosis
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
    paddingLeft: 40,
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
  sectionTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  diagnosisInput: {
    backgroundColor: colors.cardBackground,
    minHeight: 200,
    marginBottom: 20,
    textAlignVertical: "top",
  },
});
