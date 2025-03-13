import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, Badge } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../theme/colors";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const consultationHistory = [
  {
    id: 1,
    doctorName: "Dr. Sarah Wilson",
    specialty: "General Practitioner",
    date: "2024-02-28",
    time: "10:00 AM",
    status: "Completed",
    diagnosis: "Common Cold",
    prescription: "Available",
    mc: "Available",
  },
  {
    id: 2,
    doctorName: "Dr. James Lee",
    specialty: "Dermatologist",
    date: "2024-02-15",
    time: "2:30 PM",
    status: "Completed",
    diagnosis: "Skin Rash",
    prescription: "Available",
    mc: "Not Issued",
  },
];

export default function History() {
  const navigation = useNavigation<NavigationProp<any>>();
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
            onPress={() => navigation.navigate("ConsultationDetails")}
          >
            <Card.Content>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.doctorName}>
                    {consultation.doctorName}
                  </Text>
                  <Text style={styles.specialty}>{consultation.specialty}</Text>
                </View>
                <FontAwesome
                  name='chevron-right'
                  size={16}
                  color={colors.primary}
                />
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
                <Text style={styles.label}>Diagnosis:</Text>
                <Text style={styles.value}>{consultation.diagnosis}</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
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
