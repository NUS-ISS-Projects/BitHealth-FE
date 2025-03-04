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
  { label: "Invoice No.", field: "invoiceNo" },
  { label: "Invoice Date", field: "invoiceDate" },
  { label: "Doctor Name", field: "doctorName" },
  { label: "Item Name", field: "itemName" },
  { label: "Quantity", field: "quantity", multiline: true },
  { label: "Amount", field: "amount", multiline: true },
];

export default function PrescriptionDetailsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [formData, setFormData] = useState({
    invoiceNo: "",
    invoiceDate: "",
    doctorName: "",
    itemName: "",
    quantity: "",
    amount: "",
  });
  const [status, setStatus] = useState("Pending");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerBar}>Enter Presciption Details</Text>
      </View>
      <View style={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            {formFields.map((field) => (
              <TextInput
                key={field.field}
                label={field.label}
                mode='outlined'
                value={formData[field.field as keyof typeof formData]}
                onChangeText={handleChange(
                  field.field as keyof typeof formData
                )}
                style={styles.input}
                multiline={field.multiline}
                numberOfLines={field.multiline ? 4 : 1}
                theme={{
                  colors: {
                    primary: colors.primary,
                  },
                }}
              />
            ))}

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
    paddingLeft: 35,
  },
  contentContainer: {
    paddingBottom: 40,
    flex: 1,
  },
  card: {
    padding: 15,
    backgroundColor: colors.cardBackground,
  },
  input: {
    marginBottom: 15,
  },
  statusContainer: {
    marginVertical: 20,
    alignItems: "flex-start",
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
