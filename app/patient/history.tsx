import { formatDate, formatTime } from "@/helper/dateTimeFormatter";
import { getStatusColor } from "@/helper/statusColor";
import { FontAwesome } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Badge, Card, Text } from "react-native-paper";
import colors from "../theme/colors";
import { API_URL } from "@/configs/config";

const getData = async (key: string) => {
  if (Platform.OS === "web") {
    // Use localStorage for web
    return localStorage.getItem(key);
  } else {
    // Use expo-secure-store for mobile
    return await SecureStore.getItemAsync(key);
  }
};

export default function History() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [consultationHistory, setConsultationHistory] = useState<any[]>([]);

  useEffect(() => {
    async function fetchConsultationHistory() {
      const token = await getData("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
      try {
        const response = await axios.get(
          `${API_URL}/api/appointments/patient`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.map((appointment: any) => ({
          id: appointment.appointmentId,
          doctorName: appointment.doctor?.user?.name || "Unknown Doctor",
          specialty: appointment.doctor?.specialization || "",
          status: appointment.status || "Unknown",
          date: formatDate(appointment.appointmentDate),
          time: formatTime(appointment.appointmentTime),
          reason: appointment.reasonForVisit || "No diagnosis provided",
        }));
        setConsultationHistory(data);
      } catch (error) {
        console.error("Error fetching consultation history:", error);
      }
    }
    fetchConsultationHistory();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant='headlineMedium' style={styles.headerText}>
          Consultation History
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {consultationHistory.map((consultation) => (
          <Card
            key={consultation.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("ConsultationDetails", {
                appointmentId: consultation.id,
                doctorName: consultation.doctorName,
                specialty: consultation.specialty,
                appointmentDate: consultation.date,
                appointmentTime: consultation.time,
              })
            }
          >
            <Card.Content>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.doctorName}>
                    {consultation.doctorName}
                  </Text>
                  <Text style={styles.specialty}>{consultation.specialty}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Badge
                    style={[
                      styles.badge,
                      { backgroundColor: getStatusColor(consultation.status) },
                    ]}
                  >
                    {consultation.status}
                  </Badge>
                  <FontAwesome
                    name='chevron-right'
                    size={16}
                    color={colors.primary}
                  />
                </View>
              </View>

              <View style={styles.dateContainer}>
                <FontAwesome
                  name='calendar'
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.dateText}>
                  {consultation.date} | {consultation.time}
                </Text>
              </View>

              <View style={styles.detailsContainer}>
                <Text style={styles.label}>Reason for visit:</Text>
                <Text style={styles.value}>{consultation.reason}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  scrollView: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: colors.cardBackground,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
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
  badge: {
    paddingHorizontal: 20,
    width: 100,
    marginHorizontal: 10,
    color: "white",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 8,
    color: colors.textSecondary,
  },
  detailsContainer: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
  },
});
