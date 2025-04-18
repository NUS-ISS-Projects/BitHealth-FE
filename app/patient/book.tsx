import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Card, IconButton, Text } from "react-native-paper";
import colors from "../theme/colors";

type Doctor = {
  doctorId: number;
  specialization: string;
  avatar?: string;
  user: {
    name: string;
  };
};

type BookScreenParams = {
  reason: string;
  checkupType: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getData = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    // Use localStorage for web
    return localStorage.getItem(key);
  } else {
    // Use expo-secure-store for mobile
    return await SecureStore.getItemAsync(key);
  }
};

const getAvatarSource = (doctor: Doctor) => {
  if (doctor.avatar) {
    return { uri: doctor.avatar };
  }
  // Generate a random avatar using UI Avatars service
  return { uri: `https://i.pravatar.cc/50?img=${doctor.doctorId}` };
};

export default function SelectDoctor() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { reason, checkupType } = (route.params || {}) as Partial<BookScreenParams>;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const authToken = await getData("authToken");
        if (!authToken) {
          console.error("No authentication token found.");
          return;
        }
        setToken(authToken);

        const response = await axios.get(`${API_URL}/api/doctors`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        console.log("Response from API:", response.data); // Debugging

        const transformedDoctors = response.data.map((doctor: any) => ({
          doctorId: doctor.doctorId,
          specialization: doctor.specialization,
          avatar: doctor.avatar,
          user: {
            name: doctor.user.name, // Extract name from the nested user object
          },
        }));

        console.log("Transformed Doctors:", transformedDoctors); // Debugging
        setDoctors(transformedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleNext = () => {
    if (selectedDoctor) {
      navigation.navigate("AppointmentDate", {
        doctorId: selectedDoctor.doctorId,
        doctorName: selectedDoctor.user.name,
        specialty: selectedDoctor.specialization,
        reason: reason || "Unknown Reason",
        checkupType: checkupType || "Unknown Checkup Type",
        isRescheduling: false,
      });
    }
  };

  return (
    <LinearGradient
      colors={["#00451a", "#015e25", "#055127"]}
      style={styles.gradientContainer}
    >
      <View style={styles.headerBarContainer}>
        <IconButton
          mode="contained"
          icon="arrow-left"
          iconColor="#123D1F"
          containerColor="white"
          size={18}
          onPress={() => navigation.goBack()}
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

      <ScrollView style={styles.listContainer}>
        {doctors.map((doctor) => {
          const isSelected = selectedDoctor?.doctorId === doctor.doctorId;
          return (
            <TouchableOpacity
              key={doctor.doctorId} // Add the key here
              onPress={() => setSelectedDoctor(doctor)}
            >
              <Card style={[styles.card, isSelected && styles.selectedCard]}>
                <Card.Content style={styles.cardContent}>
                  <Avatar.Image size={50} source={getAvatarSource(doctor)} />
                  <View style={styles.doctorInfo}>
                    <Text
                      style={[
                        styles.doctorName,
                        isSelected && styles.selectedDoctorName,
                      ]}
                    >
                      {doctor.user.name || "Unknown Doctor"} {/* Fallback for missing name */}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={[
                          styles.specialty,
                          isSelected && styles.selectedSpecialty,
                        ]}
                      >
                        {doctor.specialization || "Unknown Specialty"}
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
          mode="contained"
          style={styles.nextButton}
          labelStyle={styles.nextButtonText}
          onPress={handleNext}
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