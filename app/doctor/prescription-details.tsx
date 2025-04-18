import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  Chip,
} from "react-native-paper";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";
import colors from "../theme/colors";
import { API_URL } from "@/configs/config";
import axios from "axios";
import {
  formatDateForDisplay,
  formatDateForSaving,
  formatLastVerified,
} from "../../helper/dateTimeFormatter";
import {
  DatePickerModal,
  en,
  registerTranslation,
} from "react-native-paper-dates";

type AppointmentParams = {
  appointmentId?: string;
  appointmentDate?: string;
};

registerTranslation("en", en);

export default function PrescriptionDetailsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { appointmentId, appointmentDate } = route.params as AppointmentParams;
  const year = appointmentDate
    ? new Date(appointmentDate).getFullYear()
    : new Date().getFullYear();
  const autoInvoiceNo = appointmentId ? `INV-${year}-${appointmentId}` : "";

  // Prescription state holds the entire prescription response
  const [prescription, setPrescription] = useState<any>(null);
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(null);
  const [showInvoiceDatePicker, setShowInvoiceDatePicker] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // List of medicine items
  const [medicines, setMedicines] = useState<
    {
      medicineName: string;
      purpose: string;
      dosage: string;
      duration: string;
      notes: string;
    }[]
  >([{ medicineName: "", purpose: "", dosage: "", duration: "", notes: "" }]);

  const onInvoiceDateConfirm = (params: any) => {
    setShowInvoiceDatePicker(false);
    setInvoiceDate(params.date);
  };

  // Update a medicine item at a given index
  const handleMedicineChange =
    (
      index: number,
      field: "medicineName" | "purpose" | "dosage" | "duration" | "notes"
    ) =>
    (value: string) => {
      const newMedicines = [...medicines];
      newMedicines[index][field] = value;
      setMedicines(newMedicines);
    };

  // Add a new blank medicine item to the list
  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { medicineName: "", purpose: "", dosage: "", duration: "", notes: "" },
    ]);
  };

  // Remove a medicine item from the list by index
  const handleRemoveMedicine = (index: number) => {
    if (medicines.length > 1) {
      const newMedicines = medicines.filter((_, idx) => idx !== index);
      setMedicines(newMedicines);
    }
  };

  // Approve action
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/api/prescriptions/verify/${prescription.prescriptionId}`,
        {
          lastVerified: new Date().toLocaleString(),
        }
      );
      if (response.status === 200) {
        setPrescription({
          ...prescription,
          lastVerified: response.data.lastVerified,
        });
        showAlert("Success", "MC verified successfully.");
        fetchPrescription();
      }
    } catch (error) {
      console.error("Failed to verify certificate:", error);
      showAlert("Error", "Failed to verify MC.");
    }
  };

  const fetchPrescription = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/prescriptions/appointment/${appointmentId}`
      );
      setPrescription(response.data);
      if (response.data.invoiceDate) {
        setInvoiceDate(new Date(response.data.invoiceDate));
      }
      if (response.data.medicineList && response.data.medicineList.length > 0) {
        setMedicines(response.data.medicineList);
      }
    } catch (error) {
      console.error("Failed to fetch medical certificate:", error);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchPrescription();
    }
  }, [appointmentId]);

  const handleSavePresciption = async () => {
    const formattedInvoiceDate = invoiceDate
      ? formatDateForSaving(invoiceDate.toISOString())
      : "";
    if (prescription) {
      // Update presciption
      try {
        const response = await axios.put(
          `${API_URL}/api/prescriptions/${prescription.prescriptionId}`,
          {
            invoiceDate: formattedInvoiceDate,
            medicineList: medicines,
          }
        );
        if (response.status === 200) {
          setPrescription(response.data);
          console.log("Prescription updated.");
          showAlert("Success", "Prescription updated successfully.");
          fetchPrescription();
        }
      } catch (error) {
        console.error("Failed to update prescription:", error);
      }
    } else {
      // Create new prescription
      try {
        const response = await axios.post(`${API_URL}/api/prescriptions`, {
          appointmentId,
          invoiceNo: autoInvoiceNo,
          invoiceDate: formattedInvoiceDate,
          medicineList: medicines,
        });
        if (response.status === 200 || response.status === 201) {
          setPrescription(response.data);
          showAlert("Success", "Prescription created successfully.");
          console.log("Prescription created.");
          fetchPrescription();
        }
      } catch (error) {
        console.error("Failed to create prescription:", error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
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
          <Text style={styles.headerBar}>Enter Prescription Details</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          {/* Invoice Fields */}
          <Text style={styles.fieldsHeader}>Invoice No.</Text>
          <TextInput
            disabled
            textColor='black'
            value={autoInvoiceNo}
            style={[styles.input, { backgroundColor: "#F0F0F0" }]}
            theme={{ colors: { primary: "white" } }}
          />
          <Text style={styles.fieldsHeader}>Invoice Date</Text>
          <TouchableOpacity onPress={() => setShowInvoiceDatePicker(true)}>
            <TextInput
              placeholder='Select Invoice Date'
              mode='outlined'
              value={
                invoiceDate
                  ? formatDateForDisplay(invoiceDate.toISOString())
                  : ""
              }
              style={styles.input}
              theme={{ colors: { primary: "white" } }}
              editable={false}
              pointerEvents='none'
            />
          </TouchableOpacity>
          <DatePickerModal
            locale='en'
            mode='single'
            visible={showInvoiceDatePicker}
            onDismiss={() => setShowInvoiceDatePicker(false)}
            date={invoiceDate || new Date()}
            onConfirm={onInvoiceDateConfirm}
          />

          {/* Render Medicine Items */}
          {medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineItem}>
              <View style={styles.medicineHeaderRow}>
                <Text style={styles.medicineItemHeader}>
                  Medicine #{index + 1}
                </Text>
                {medicines.length > 1 && (
                  <IconButton
                    icon='trash-can-outline'
                    size={20}
                    iconColor={colors.primary}
                    onPress={() => handleRemoveMedicine(index)}
                  />
                )}
              </View>
              <Text style={styles.fieldsHeader}>Medicine Name</Text>
              <TextInput
                placeholder='e.g. Paracetamol'
                mode='outlined'
                value={medicine.medicineName}
                onChangeText={handleMedicineChange(index, "medicineName")}
                style={styles.input}
                theme={{ colors: { primary: "white" } }}
              />
              <Text style={styles.fieldsHeader}>Purpose</Text>
              <TextInput
                placeholder='e.g. For fever'
                mode='outlined'
                value={medicine.purpose}
                onChangeText={handleMedicineChange(index, "purpose")}
                style={styles.input}
                theme={{ colors: { primary: "white" } }}
              />
              <Text style={styles.fieldsHeader}>Dosage</Text>
              <TextInput
                placeholder='e.g. Twice Daily'
                mode='outlined'
                value={medicine.dosage}
                onChangeText={handleMedicineChange(index, "dosage")}
                style={styles.input}
                theme={{ colors: { primary: "white" } }}
              />
              <Text style={styles.fieldsHeader}>Duration</Text>
              <TextInput
                placeholder='e.g. 7 days'
                mode='outlined'
                value={medicine.duration}
                onChangeText={handleMedicineChange(index, "duration")}
                style={styles.input}
                theme={{ colors: { primary: "white" } }}
              />
              <Text style={styles.fieldsHeader}>Notes</Text>
              <TextInput
                placeholder='e.g. After meals'
                mode='outlined'
                value={medicine.notes}
                onChangeText={handleMedicineChange(index, "notes")}
                multiline
                numberOfLines={3}
                style={styles.input}
                theme={{ colors: { primary: "white" } }}
              />
            </View>
          ))}

          <Button
            mode='outlined'
            style={styles.addButton}
            labelStyle={styles.addButtonText}
            onPress={handleAddMedicine}
            icon='plus'
          >
            Add Medicine
          </Button>

          <View style={styles.statusContainer}>
            <Chip
              mode='flat'
              style={[
                styles.statusChip,
                prescription && prescription.isVerified
                  ? styles.approvedChip
                  : styles.pendingChip,
              ]}
              textStyle={styles.statusChipText}
            >
              {prescription && prescription.isVerified ? "Approved" : "Pending"}
            </Chip>
            {prescription && prescription.isVerified && (
              <Text style={styles.lastUpdatedText}>
                Last Updated:{" "}
                {formatLastVerified(prescription.lastVerified.toLocaleString())}
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode='contained'
              style={[styles.button, styles.updateButton]}
              labelStyle={styles.updateButtonText}
              onPress={handleSavePresciption}
            >
              {prescription ? "Update prescription" : "Create Prescription"}
            </Button>
          </View>
          {prescription && (
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
          )}
        </Card.Content>
      </Card>
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
    fontWeight: "400",
    color: colors.primary,
  },
  fieldsHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    padding: 15,
    backgroundColor: colors.cardBackground,
  },
  input: {
    marginBottom: 15,
  },
  medicineItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 10,
  },
  medicineHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  medicineItemHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    paddingVertical: 10,
    marginBottom: 20,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  button: {
    borderRadius: 50,
    paddingVertical: 10,
    flex: 1,
    marginRight: 10,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.accent,
  },
  updateButton: {
    backgroundColor: "white",
    marginRight: 0,
    borderColor: colors.primary,
    borderWidth: 1,
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
