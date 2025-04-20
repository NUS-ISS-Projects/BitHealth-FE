import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, IconButton, Text } from "react-native-paper";
import {
  DatePickerModal,
  enGB,
  registerTranslation,
  TimePickerModal,
} from "react-native-paper-dates";
import colors from "../theme/colors";

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

  const normalizeTime = (inputTime: string | number[] | undefined): string | null => {
    if (!inputTime) return null;

    if (typeof inputTime === "string") {
      const [hours, minutes] = inputTime.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }
    } else if (Array.isArray(inputTime)) {
      const [hours, minutes] = inputTime;
      if (!isNaN(hours) && !isNaN(minutes)) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }
    }

    return null;
  };

  const [time, setTime] = useState<string | null>(
    isRescheduling ? normalizeTime(currentTime) : null
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);

  // State for web-specific time picker
  const [webTime, setWebTime] = useState<string | null>(null);
  const isWeb = Platform.OS === "web";

  const headerText = isRescheduling
    ? "Reschedule Appointment"
    : "Select date and time";

  const handleDateConfirm = (params: any) => {
    setOpenDatePicker(false);
    setDate(params.date);
  };

  const handleNext = () => {
    const formattedDate = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      : null;

    const formattedTime = isWeb ? webTime : time;

    if (!formattedDate || !formattedTime) {
      console.error("Invalid date or time");
      return;
    }

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
      {/* Header Bar */}
      <View style={styles.headerBarContainer}>
        <IconButton
          mode="contained"
          icon="arrow-left"
          iconColor={colors.primary}
          containerColor="white"
          size={18}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerBar}>{headerText}</Text>
      </View>

      {/* Doctor Information Card */}
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
              <Text style={styles.specialty}>{specialty}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Date Picker Section */}
      <View style={styles.dateContainer}>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>📅 Select a date here</Text>
        </View>
        <Button
          mode="outlined"
          onPress={() => setOpenDatePicker(true)}
          style={styles.dateButton}
          labelStyle={styles.dateButtonText}
        >
          {date ? date.toDateString() : "Pick a Date"}
        </Button>
      </View>

      {/* Time Picker Section */}
      <View style={styles.dateContainer}>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>⏰ Select a time here</Text>
        </View>
        {isWeb ? (
          <input
            type="time"
            value={webTime || ""}
            onChange={(e) => setWebTime(e.target.value)}
            style={styles.webTimeInput}
          />
        ) : (
          <Button
            mode="outlined"
            onPress={() => setOpenDatePicker(true)}
            style={styles.dateButton}
            labelStyle={styles.dateButtonText}
          >
            {time ? time : "Pick a Time"}
          </Button>
        )}
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        locale="en"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={date || new Date()}
        onConfirm={handleDateConfirm}
      />

      {/* Time Picker Modal (Mobile Only) */}
      {!isWeb && (
        <TimePickerModal
          visible={openDatePicker}
          onDismiss={() => setOpenDatePicker(false)}
          onConfirm={(params) => {
            const { hours, minutes } = params;
            if (!isNaN(hours) && !isNaN(minutes)) {
              const normalizedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
              setTime(normalizedTime);
            } else {
              console.error("Invalid time selected");
            }
          }}
        />
      )}

      {/* Next Button */}
      <View style={{ paddingVertical: 5 }}></View>
      <Button
        mode="contained"
        style={styles.nextButton}
        labelStyle={styles.nextButtonText}
        onPress={handleNext}
        disabled={!date || (!time && !webTime)}
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
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
    paddingLeft: 50,
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
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: colors.textSecondary,
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
  webTimeInput: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderColor: colors.primary, // Match the dateButton's border color
    borderWidth: 1, // Match the dateButton's border width
    borderRadius: 50, // Match the dateButton's border radius
    color: colors.textPrimary, // Ensure text color matches
    backgroundColor: "white", // Optional: Ensure background matches
  },
});