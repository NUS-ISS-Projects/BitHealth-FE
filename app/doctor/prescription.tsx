import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button, IconButton } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import colors from "../theme/colors";
import { FontAwesome } from "@expo/vector-icons";

const PrescriptionScreen: React.FC = () => {
  const {
    appointmentId,
    patientName = "John Doe",
    patientDetails = "Hello Dr, I am down with a cold and having sort throat.",
    date = "12 Jan 2024, 8am-10am",
  } = useLocalSearchParams();

  const navigation = useNavigation<NavigationProp<any>>();

  const handleDiagnosis = () => {
    navigation.navigate("PatientDiagnosis", { appointmentId });
  };

  const handleMedicalCertificate = () => {
    navigation.navigate("MedicalCertificate", { appointmentId });
  };

  const handlePrescription = () => {
    navigation.navigate("PrescriptionDetails", { appointmentId });
  };

  const handleComplete = () => {
    navigation.navigate("DashboardMain");
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
        <Text style={styles.headerBar}>Appointment Details</Text>
      </View>
      {/* Patient Details Card */}
      <Card style={styles.card}>
        <View style={styles.cardHeaderContainer}>
          <FontAwesome name='clock-o' size={24} color='#123D1F' />
          <Text style={styles.cardHeader}>{date}</Text>
        </View>
        <Card.Title
          title={patientName}
          left={(props) => (
            <Card.Cover
              {...props}
              source={require("../../assets/images/favicon.png")}
              style={styles.avatar}
            />
          )}
        />
        <Card.Content>
          <Text style={styles.detailheading}>Comment:</Text>
          <Text style={styles.detailsText}>{patientDetails}</Text>
        </Card.Content>
      </Card>

      {/* Buttons to upload documents */}
      <View style={styles.buttonsContainer}>
        <Button
          mode='outlined'
          style={styles.outlinedButton}
          labelStyle={styles.outlinedButtonText}
          onPress={handleDiagnosis}
          icon={() => (
            <FontAwesome name='stethoscope' size={20} color={colors.primary} />
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
            <FontAwesome name='file-text-o' size={20} color={colors.primary} />
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
        <Button
          mode='contained'
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={handleComplete}
          icon={() => (
            <FontAwesome name='check-circle' size={20} color='#FFFFFF' />
          )}
        >
          Complete Appointment
        </Button>
      </View>
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
    paddingLeft: 50,
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
