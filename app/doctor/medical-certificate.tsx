import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
const API_URL = process.env.EXPO_PUBLIC_API_URL;
import axios from "axios";
import {
  formatDate,
  formatDateForDisplay,
  formatDateForSaving,
} from "../../helper/dateTimeFormatter";
import { DatePickerModal } from "react-native-paper-dates";

type AppointmentParams = {
  appointmentId?: string;
  userName?: string;
  appointmentDate?: string;
};

export default function MedicalCertificateScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { appointmentId, userName, appointmentDate } =
    route.params as AppointmentParams;
  const year = appointmentDate
    ? new Date(appointmentDate).getFullYear()
    : new Date().getFullYear();
  const autoMCNo = appointmentId ? `MC-${year}-${appointmentId}` : "";
  const [status, setStatus] = useState("Pending");
  const [noOfDays, setNoOfDays] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [issueDate, setIssueDate] = useState<Date | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(null);
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
  const [showEffectiveDatePicker, setShowEffectiveDatePicker] = useState(false);

  const onEffectiveDateConfirm = (params: any) => {
    setShowEffectiveDatePicker(false);
    setEffectiveDate(params.date);
  };

  const onIssueDateConfirm = (params: any) => {
    setShowIssueDatePicker(false);
    setIssueDate(params.date);
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
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerBar}>
            Enter Medical Certificate Details
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Title
            title={`Patient name: ${userName}`}
            subtitle={`Date of visit: ${formatDate(appointmentDate || "")}`}
            titleStyle={{ color: "black", fontWeight: "bold" }}
            subtitleStyle={{ color: "black", fontWeight: "bold" }}
          />
          <Card.Content>
            <View style={styles.statusContainer}>
              <Text style={styles.fieldsHeader}>MC No.</Text>
              <TextInput
                value={autoMCNo}
                disabled
                textColor='black'
                style={[styles.input, { backgroundColor: "#F0F0F0" }]}
                theme={{ colors: { primary: "white" } }}
              />
              <Text style={styles.fieldsHeader}>No. of Days</Text>
              <TextInput
                value={noOfDays}
                placeholder='Enter No. of Days'
                onChangeText={(text) => setNoOfDays(text)}
                style={styles.input}
                theme={{ colors: { primary: "white" } }}
                keyboardType='numeric'
              />
              {/* Issue Date with DatePicker */}
              <Text style={styles.fieldsHeader}>Issue Date</Text>
              <TouchableOpacity onPress={() => setShowIssueDatePicker(true)}>
                <TextInput
                  placeholder='Select Issue Date'
                  value={
                    issueDate
                      ? formatDateForDisplay(issueDate.toISOString())
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
                visible={showIssueDatePicker}
                onDismiss={() => setShowIssueDatePicker(false)}
                date={issueDate || new Date()}
                onConfirm={onIssueDateConfirm}
              />
              {/* Effective From with DatePicker */}
              <Text style={styles.fieldsHeader}>With Effect From</Text>
              <TouchableOpacity
                onPress={() => setShowEffectiveDatePicker(true)}
              >
                <TextInput
                  value={
                    effectiveDate
                      ? formatDateForDisplay(effectiveDate.toISOString())
                      : ""
                  }
                  placeholder='Select Effective Date'
                  style={styles.input}
                  theme={{ colors: { primary: "white" } }}
                  editable={false}
                  pointerEvents='none'
                />
              </TouchableOpacity>
              <DatePickerModal
                locale='en'
                mode='single'
                visible={showEffectiveDatePicker}
                onDismiss={() => setShowEffectiveDatePicker(false)}
                date={effectiveDate || new Date()}
                onConfirm={onEffectiveDateConfirm}
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
            </View>
            <View style={styles.buttonContainer}>
              <Button
                mode='contained'
                style={[styles.button, styles.updateButton]}
                labelStyle={styles.updateButtonText}
                onPress={handleApprove}
              >
                Update MC
              </Button>
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
  },
  fieldsHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    marginTop: 10,
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    flex: 1,
    marginRight: 10,
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
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.accent,
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
