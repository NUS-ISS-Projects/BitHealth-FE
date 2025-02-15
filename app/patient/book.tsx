import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text, Button, Avatar, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../theme/colors";

const doctors = [
  {
    id: 1,
    name: "Dr. Budi Sound",
    specialty: "Aesthetic Doctor",
    rating: 5.0,
    reviews: 780,
    image: require("../../assets/images/favicon.png"),
  },
  {
    id: 2,
    name: "Dr. Sober Roam",
    specialty: "Aesthetic Doctor",
    rating: 4.9,
    reviews: 422,
    image: require("../../assets/images/favicon.png"),
  },
  {
    id: 3,
    name: "Dr. Anastasia Satset",
    specialty: "Aesthetic Doctor",
    rating: 4.9,
    reviews: 128,
    image: require("../../assets/images/favicon.png"),
  },
  {
    id: 4,
    name: "Dr. Eni Teri",
    specialty: "Aesthetic Doctor",
    rating: 4.8,
    reviews: 76,
    image: require("../../assets/images/favicon.png"),
  },
  {
    id: 5,
    name: "Dr. Widi Striker",
    specialty: "Aesthetic Doctor",
    rating: 4.7,
    reviews: 45,
    image: require("../../assets/images/favicon.png"),
  },
  {
    id: 6,
    name: "Dr. Goh",
    specialty: "Aesthetic Doctor",
    rating: 4.7,
    reviews: 45,
    image: require("../../assets/images/favicon.png"),
  },
  {
    id: 7,
    name: "Dr. Tan",
    specialty: "Aesthetic Doctor",
    rating: 4.7,
    reviews: 45,
    image: require("../../assets/images/favicon.png"),
  },
];

export default function SelectDoctor() {
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof doctors)[0] | null
  >(null);
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#00451a", "#015e25", "#055127"]}
      style={styles.gradientContainer}
    >
      <View style={styles.headerBarContainer}>
        <IconButton
          mode='contained'
          icon='arrow-left'
          iconColor='#123D1F'
          containerColor='white'
          size={18}
          onPress={() => router.back()}
        />
        <Text style={styles.headerBar}>Make appointment</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Choose</Text>
          <Text style={styles.header}>the doctor</Text>
        </View>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>2/4</Text>
        </View>
      </View>

      {/* Doctor List */}
      <ScrollView style={styles.listContainer}>
        {doctors.map((doctor) => {
          const isSelected = selectedDoctor?.id === doctor.id;
          return (
            <TouchableOpacity
              key={doctor.id}
              onPress={() => setSelectedDoctor(doctor)}
            >
              <Card style={[styles.card, isSelected && styles.selectedCard]}>
                <Card.Content style={styles.cardContent}>
                  <Avatar.Image size={50} source={doctor.image} />
                  <View style={styles.doctorInfo}>
                    <Text
                      style={[
                        styles.doctorName,
                        isSelected && styles.selectedDoctorName,
                      ]}
                    >
                      {doctor.name}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={[
                          styles.specialty,
                          isSelected && styles.selectedSpecialty,
                        ]}
                      >
                        {doctor.specialty}
                      </Text>
                      <Text
                        style={[styles.dot, isSelected && styles.selectedDot]}
                      >
                        ·
                      </Text>
                      <Text
                        style={[
                          styles.rating,
                          isSelected && styles.selectedRating,
                        ]}
                      >
                        ⭐ {doctor.rating} ({doctor.reviews})
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode='contained'
          style={styles.nextButton}
          labelStyle={styles.nextButtonText}
          onPress={() =>
            router.push(
              `/patient/appointmentDate?doctor=${selectedDoctor?.name}`
            )
          }
          disabled={!selectedDoctor}
        >
          Next
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
  },
  headerBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 5,
  },
  headerBar: {
    fontSize: 15,
    fontWeight: "regular",
    color: "#FFFFFF",
    paddingLeft: 70,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  progressContainer: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
  listContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: "#022815",
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: "#FFFFFF",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorInfo: {
    paddingLeft: 15,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingBottom: 5,
  },
  selectedDoctorName: {
    color: colors.primary,
  },
  specialty: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    paddingRight: 5,
  },
  selectedSpecialty: {
    color: colors.accent,
  },
  rating: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  selectedRating: {
    color: colors.accent,
  },
  dot: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 5,
  },
  selectedDot: {
    color: colors.accent,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 5,
  },
  nextButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    paddingVertical: 5,
    alignSelf: "center",
    width: 150,
  },
  nextButtonText: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
