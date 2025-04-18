import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button, IconButton } from "react-native-paper";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";
import colors from "../theme/colors";
import { FontAwesome } from "@expo/vector-icons";
import { formatDate, formatTime } from "../../helper/dateTimeFormatter";
import { getAvatarSource } from "../../helper/avatarGenerator";
import { API_URL } from "@/configs/config";
import axios from "axios";

type AppointmentParams = {
  appointmentId?: string;
  userName?: string;
  patientUserId?: number;
  appointmentDate?: string;
  appointmentTime?: string;
  comment?: string;
  reasonForVisit?: string;
  appointmentStatus?: string;
};

const PrescriptionScreen: React.FC = () => {
  const route = useRoute();
  const {
    appointmentId,
    userName,
    patientUserId,
    appointmentDate,
    appointmentTime,
    comment,
    reasonForVisit,
    appointmentStatus,
  } = route.params as AppointmentParams;

  const navigation = useNavigation<NavigationProp<any>>();

  const handleDiagnosis = () => {
    navigation.navigate("PatientDiagnosis", { appointmentId, appointmentDate });
  };

  const handleMedicalCertificate = () => {
    navigation.navigate("MedicalCertificate", {
      appointmentId,
      userName,
      appointmentDate,
    });
  };

  const handlePrescription = () => {
    navigation.navigate("PrescriptionDetails", { appointmentId });
  };

  const updateAppointmentStatus = async (newStatus: string) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/appointments/updateStatus/${appointmentId}`,
        { status: newStatus }
      );
      if (response.status === 200) {
        navigation.navigate("Appointments");
      }
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
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
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerBar}>Appointment Details</Text>
        </View>
      </View>
      {/* Patient Details Card */}
      <Card style={styles.card}>
        <View style={styles.cardHeaderContainer}>
          <FontAwesome name='clock-o' size={24} color='#123D1F' />
          <Text style={styles.cardHeader}>
            {formatDate(appointmentDate || "")} |{" "}
            {formatTime(appointmentTime || "")}
          </Text>
        </View>
        <Card.Title
          title={userName}
          titleStyle={styles.cardUser}
          subtitle={reasonForVisit}
          subtitleStyle={styles.subtitle}
          left={(props) => (
            <Card.Cover
              {...props}
              source={getAvatarSource({
                id: patientUserId || 0,
                image: "",
              })}
              style={styles.avatar}
            />
          )}
        />
        <Card.Content>
          <Text style={styles.detailheading}>Comment:</Text>
          <Text style={styles.detailsText}>{comment}</Text>
        </Card.Content>
      </Card>

      {!(
        appointmentStatus === "REJECTED" || appointmentStatus === "CANCELLED"
      ) && (
        <View style={styles.buttonsContainer}>
          <Button
            mode='outlined'
            style={styles.outlinedButton}
            labelStyle={styles.outlinedButtonText}
            onPress={handleDiagnosis}
            icon={() => (
              <FontAwesome
                name='stethoscope'
                size={20}
                color={colors.primary}
              />
            )}
          >
            Diagnosis
          </Button>
          <Button
            mode='outlined'
            style={styles.outlinedButton}
            labelStyle={styles.outlinedButtonText}
            onPress={handleMedicalCertificate}
            icon={() => (
              <FontAwesome
                name='file-text-o'
                size={20}
                color={colors.primary}
              />
            )}
          >
            Medical Certificate
          </Button>
          <Button
            mode='outlined'
            style={styles.outlinedButton}
            labelStyle={styles.outlinedButtonText}
            onPress={handlePrescription}
            icon={() => (
              <FontAwesome name='star' size={20} color={colors.primary} />
            )}
          >
            Prescription
          </Button>
          {appointmentStatus === "PENDING" && (
            <View style={styles.buttonsContainer}>
              <Button
                mode='contained'
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={() => updateAppointmentStatus("CONFIRMED")}
                icon={() => (
                  <FontAwesome name='check-circle' size={20} color='#FFFFFF' />
                )}
              >
                Accept Appointment
              </Button>
              <Button
                mode='contained'
                style={[styles.rejectButton]}
                labelStyle={styles.rejectbuttonText}
                onPress={() => updateAppointmentStatus("REJECTED")}
                icon={() => (
                  <FontAwesome name='times-circle' size={20} color='#123D1F' />
                )}
              >
                Reject Appointment
              </Button>
            </View>
          )}
          {appointmentStatus === "CONFIRMED" && (
            <Button
              mode='contained'
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={() => updateAppointmentStatus("COMPLETED")}
              icon={() => (
                <FontAwesome name='check-circle' size={20} color='#FFFFFF' />
              )}
            >
              Complete Appointment
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default PrescriptionScreen;

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
  cardHeaderContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    paddingBottom: 10,
    flexDirection: "row",
  },
  cardHeader: {
    marginLeft: 10,
    fontSize: 18,
    color: colors.primary,
    fontWeight: "bold",
  },
  cardUser: {
    marginLeft: 10,
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginLeft: 10,
    color: colors.textSecondary,
    fontWeight: "bold",
  },
  card: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: colors.cardBackground,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  detailheading: {
    fontSize: 12,
    color: colors.textSecondary,
    paddingVertical: 5,
  },
  detailsText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  buttonsContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    marginBottom: 20,
  },
  rejectbuttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  rejectButton: {
    borderColor: colors.primary,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  outlinedButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    paddingVertical: 10,
    marginBottom: 20,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  outlinedButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
});
