import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Avatar, Card, IconButton } from "react-native-paper";
import {
  enGB,
  registerTranslation,
  DatePickerModal,
  TimePickerModal,
} from "react-native-paper-dates";
import colors from "../theme/colors";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";

type AppointmentParams = {
  doctorId: number;
  doctorName: string;
  specialty: string;
  reason?: string;
  checkupType?: string;
  isRescheduling: boolean;
  appointmentId: string;
  currentDate?: string | Date | number[];
  currentTime?: string | number[];
};

export default function AppointmentDate() {
  registerTranslation("en", enGB);
  const route = useRoute();
  const {
    doctorId,
    doctorName,
    specialty,
    reason,
    checkupType,
    isRescheduling,
    appointmentId,
    currentDate,
    currentTime,
  } = route.params as AppointmentParams;
  const navigation = useNavigation<NavigationProp<any>>();
  const [date, setDate] = useState<Date | null>(
    isRescheduling && currentDate
      ? new Date(Array.isArray(currentDate) ? currentDate[0] : currentDate)
      : null
  );
  const [time, setTime] = useState<string | null>(
    isRescheduling
      ? typeof currentTime === "string"
        ? currentTime
        : Array.isArray(currentTime)
        ? String(currentTime[0])
        : null
      : null
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const headerText = isRescheduling
    ? "Reschedule Appointment"
    : "Select date and time";

  const handleDateConfirm = (params: any) => {
    setOpenDatePicker(false);
    setDate(params.date);
  };

  const handleTimeConfirm = (params: any) => {
    setOpenTimePicker(false);
    setTime(
      `${params.hours}:${params.minutes < 10 ? "0" : ""}${params.minutes}`
    );
  };

  const handleNext = () => {
    // Format date to YYYY-MM-DD
    const formattedDate = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      : null;

    // Format time to HH:mm:ss
    const formattedTime = time ? `${time}:00` : null;

    if (isRescheduling) {
      navigation.navigate("ConfirmAppointment", {
        isRescheduling: true,
        appointmentId,
        doctorName,
        specialty,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
      });
    } else {
      navigation.navigate("ConfirmAppointment", {
        doctorId,
        doctorName,
        specialty,
        reason,
        checkupType,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
      });
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
        <Text style={styles.headerBar}>{headerText}</Text>
      </View>
      {/* Header */}
      {!isRescheduling && (
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.header}>When</Text>
            <Text style={styles.header}>are you free?</Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>3/4</Text>
          </View>
        </View>
      )}

      {/* Doctor Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.doctorContainer}>
            <Avatar.Image
              size={50}
              source={require("../../assets/images/favicon.png")}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>
                {doctorName || "Dr. Budi Sound"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.specialty}>{specialty}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Date Selection */}
      <View style={styles.dateContainer}>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>📅 Select a date here</Text>
        </View>
        <Button
          mode='outlined'
          onPress={() => setOpenDatePicker(true)}
          style={styles.dateButton}
          labelStyle={styles.dateButtonText}
        >
          {date ? date.toDateString() : "Pick a Date"}
        </Button>
      </View>

      {/* Time Selection */}
      <View style={styles.dateContainer}>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>⏰ Select a time here</Text>
        </View>
        <Button
          mode='outlined'
          onPress={() => setOpenTimePicker(true)}
          style={styles.dateButton}
          labelStyle={styles.dateButtonText}
        >
          {time ? time : "Pick a Time"}
        </Button>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        locale='en'
        mode='single'
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={date || new Date()}
        onConfirm={handleDateConfirm}
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={handleTimeConfirm}
      />
      {/* Next Button */}
      <View style={{ paddingVertical: 5 }}></View>
      <Button
        mode='contained'
        style={styles.nextButton}
        labelStyle={styles.nextButtonText}
        onPress={handleNext}
        disabled={!date || !time}
      >
        {isRescheduling ? "Confirm New Schedule" : "Next"}
      </Button>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressContainer: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  doctorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  doctorInfo: {
    marginLeft: 15,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  specialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 5,
  },
  value: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  directions: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  dateContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textSecondary,
  },
  dateButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 50,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
