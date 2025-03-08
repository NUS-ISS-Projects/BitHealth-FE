import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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

export default function PrescriptionDetailsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  // Invoice fields remain single values
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  // List of medicine items
  const [medicines, setMedicines] = useState<
    { medicineName: string; dosage: string; duration: string; notes: string }[]
  >([{ medicineName: "", dosage: "", duration: "", notes: "" }]);

  // Status state and last updated timestamp
  const [status, setStatus] = useState("Pending");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Update invoice fields
  const handleInvoiceChange =
    (field: "invoiceNo" | "invoiceDate") => (value: string) => {
      if (field === "invoiceNo") setInvoiceNo(value);
      else setInvoiceDate(value);
    };

  // Update a medicine item at a given index
  const handleMedicineChange =
    (index: number, field: "medicineName" | "dosage" | "duration" | "notes") =>
    (value: string) => {
      const newMedicines = [...medicines];
      newMedicines[index][field] = value;
      setMedicines(newMedicines);
    };

  // Add a new blank medicine item to the list
  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { medicineName: "", dosage: "", duration: "", notes: "" },
    ]);
  };

  // Remove a medicine item from the list by index
  const handleRemoveMedicine = (index: number) => {
    // Ensure at least one medicine item remains
    if (medicines.length > 1) {
      const newMedicines = medicines.filter((_, idx) => idx !== index);
      setMedicines(newMedicines);
    }
  };

  // Approve action
  const handleApprove = () => {
    setStatus("Approved");
    setLastUpdated(new Date());
    // Here you would also trigger any save or API update
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
        <Text style={styles.headerBar}>Enter Prescription Details</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          {/* Invoice Fields */}
          <TextInput
            label='Invoice No.'
            mode='outlined'
            value={invoiceNo}
            onChangeText={handleInvoiceChange("invoiceNo")}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label='Invoice Date'
            mode='outlined'
            value={invoiceDate}
            onChangeText={handleInvoiceChange("invoiceDate")}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
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
              <TextInput
                label='Medicine Name'
                placeholder='e.g. Paracetamol'
                mode='outlined'
                value={medicine.medicineName}
                onChangeText={handleMedicineChange(index, "medicineName")}
                style={styles.input}
                theme={{ colors: { primary: colors.primary } }}
              />
              <TextInput
                label='Dosage'
                placeholder='e.g. Twice Daily'
                mode='outlined'
                value={medicine.dosage}
                onChangeText={handleMedicineChange(index, "dosage")}
                style={styles.input}
                theme={{ colors: { primary: colors.primary } }}
              />
              <TextInput
                label='Duration'
                placeholder='e.g. 7 days'
                mode='outlined'
                value={medicine.duration}
                onChangeText={handleMedicineChange(index, "duration")}
                style={styles.input}
                theme={{ colors: { primary: colors.primary } }}
              />
              <TextInput
                label='Notes'
                placeholder='e.g. After meals'
                mode='outlined'
                value={medicine.notes}
                onChangeText={handleMedicineChange(index, "notes")}
                style={styles.input}
                multiline
                numberOfLines={3}
                theme={{ colors: { primary: colors.primary } }}
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
    paddingLeft: 35,
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
  },
  button: {
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
