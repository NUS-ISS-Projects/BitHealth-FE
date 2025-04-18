import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Card, IconButton } from "react-native-paper";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";
import colors from "../theme/colors";
import { API_URL } from "@/configs/config";
import axios from "axios";

type AppointmentParams = {
  appointmentId?: string;
};

export default function PatientDiagnosisScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [diagnosis, setDiagnosis] = useState("");
  const [action, setAction] = useState("");

  const route = useRoute();
  const { appointmentId } = route.params as AppointmentParams;

  const handleSave = async () => {
    const data = {
      diagnosis: diagnosis,
      diagnosisAction: action,
    };
    try {
      const response = await axios.put(
        `${API_URL}/api/appointments/diagnosis/${appointmentId}`,
        data
      );
      if (response.status === 200) {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error saving diagnosis:", error);
    }
  };

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/appointments/diagnosis/${appointmentId}`
        );
        setDiagnosis(response.data.diagnosis);
        setAction(response.data.diagnosisAction);
      } catch (error) {
        console.error("Error fetching diagnosis:", error);
      }
    };
    fetchDiagnosis();
  }, [appointmentId]);

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
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerBar}>Enter Patient Diagnosis</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Please provide a diagnosis of the patient's condition
            </Text>
            <TextInput
              textColor='black'
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
            <Text style={styles.sectionTitle}>
              Please provide details on what the patient should do
            </Text>
            <TextInput
              value={action}
              onChangeText={setAction}
              textColor='black'
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
    fontWeight: "bold",
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
    minHeight: 120,
    marginBottom: 20,
    textAlignVertical: "top",
  },
});
