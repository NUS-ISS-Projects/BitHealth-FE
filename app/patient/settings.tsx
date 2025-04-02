import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  Button,
  Avatar,
  SegmentedButtons,
} from "react-native-paper";
import colors from "../theme/colors";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PatientSettings() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPatientData = async () => {
      setLoading(true);
      try {
        const patientData = await fetchPatientSettings(1);
        setFullName(patientData.user.name || "");
        setGender(patientData.gender.toLowerCase() || "male");
        setEmail(patientData.user.email || "");
        setPhone(patientData.contactNumber || "");
        if (patientData.dateOfBirth) {
          setDateOfBirth(new Date(patientData.dateOfBirth));
        }
        if (patientData.avatar) {
          setAvatar(
            patientData.avatar.startsWith("data:image")
              ? patientData.avatar
              : `data:image/jpeg;base64,${patientData.avatar}`
          );
        }
      } catch (error) {
        console.error("Failed to load patient data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPatientData();
  }, []);

  async function fetchPatientSettings(patientId: number) {
    try {
      const response = await axios.get(`${API_URL}/api/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching patient settings:", error);
      throw error;
    }
  }

  const handleAvatarSelect = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        base64: true,
      });

      if (!result.canceled) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setAvatar(base64Image);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: fullName,
        email: email,
        contact_number: phone,
        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
        dateOfBirth: dateOfBirth
          ? dateOfBirth.toISOString().split("T")[0]
          : null,
        avatar: avatar,
      };

      const response = await axios.put(
        `${API_URL}/api/patients/1`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Settings</Text>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={100}
            source={
              avatar
                ? { uri: avatar }
                : require("../../assets/images/favicon.png")
            }
          />
          <TouchableOpacity
            style={styles.editAvatar}
            onPress={handleAvatarSelect}
          >
            <Text style={styles.editAvatarText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          label='Full Name'
          mode='outlined'
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          theme={{
            colors: {
              primary: colors.primary,
            },
          }}
        />
        <SegmentedButtons
          value={gender}
          onValueChange={setGender}
          style={styles.segmentedButton}
          buttons={[
            {
              value: "male",
              label: "Male",
              style: gender === "male" ? styles.activeSegment : styles.segment,
              labelStyle:
                gender === "male"
                  ? styles.activeSegmentLabel
                  : styles.segmentLabel,
            },
            {
              value: "female",
              label: "Female",
              style:
                gender === "female" ? styles.activeSegment : styles.segment,
              labelStyle:
                gender === "female"
                  ? styles.activeSegmentLabel
                  : styles.segmentLabel,
            },
          ]}
        />
        <TextInput
          label='Email'
          mode='outlined'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          style={styles.input}
          theme={{
            colors: {
              primary: colors.primary,
            },
          }}
        />
        <TextInput
          label='Phone Number'
          mode='outlined'
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
          style={styles.input}
          theme={{
            colors: {
              primary: colors.primary,
            },
          }}
        />
        <DatePickerInput
          locale='en'
          label='Date of Birth'
          value={dateOfBirth}
          onChange={(d) => setDateOfBirth(d)}
          inputMode='start'
          mode='outlined'
          style={styles.input}
          theme={{
            colors: {
              primary: colors.primary,
            },
          }}
        />

        {/* Save Button */}
        <Button
          mode='contained'
          style={styles.saveButton}
          labelStyle={styles.saveButtonText}
          onPress={handleSave}
        >
          Save Changes
        </Button>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  editAvatar: {
    marginTop: -20,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  editAvatarText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  input: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  segmentedButton: {
    marginBottom: 15,
  },
  segment: {
    borderColor: colors.primary,
  },
  segmentLabel: {
    color: colors.primary,
  },
  activeSegment: {
    backgroundColor: colors.primary,
  },
  activeSegmentLabel: {
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
