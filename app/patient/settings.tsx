import { API_URL } from "@/configs/config";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function PatientSettings() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const getData = async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };

  const clearAuthToken = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("authToken");
      } else {
        await SecureStore.deleteItemAsync("authToken");
      }
    } catch (error) {
      console.error("Error clearing auth token:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await clearAuthToken();
      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    const loadPatientData = async () => {
      setLoading(true);
      try {
        const token = await getData("authToken");
        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        // Fetch patient profile
        const profileResponse = await axios.get(
          `${API_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { userId, name } = profileResponse.data;
        setUserId(userId);

        // Fetch patient settings
        const patientData = await fetchPatientSettings(userId);
        setFullName(patientData.user.name || "");
        setEmail(patientData.user.email || "");
        setPhone(patientData.contactNumber || "");

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

  const fetchPatientSettings = async (patientId: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/patients/profile/${patientId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching patient settings:", error);
      throw error;
    }
  };

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
    try {
      const token = await getData("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
      const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { userId, name } = profileResponse.data;
      const patientData = await fetchPatientSettings(userId);
      const { patientId } = patientData;

      setLoading(true);

      const updateData = {
        name: fullName,
        email: email,
        contact_number: phone,
        avatar: avatar,
        date_of_birth: "1990-01-01",
        gender: "Unkown",
      };

      const response = await axios.put(
        `${API_URL}/api/patients/${patientId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
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
          theme={{ colors: { primary: "#007BFF" } }}
        />
        <TextInput
          label='Email'
          mode='outlined'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          style={styles.input}
          theme={{ colors: { primary: "#123D1F" } }}
        />
        <TextInput
          label='Phone Number'
          mode='outlined'
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
          style={styles.input}
          theme={{ colors: { primary: "#123D1F" } }}
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
        {/* Logout Button */}
        <Button
          mode='outlined'
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonText}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#123D1F",
    marginBottom: 20,
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  editAvatar: {
    marginTop: -20,
    backgroundColor: "#123D1F",
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
  saveButton: {
    backgroundColor: "#123D1F",
    borderRadius: 50,
    paddingVertical: 10,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoutButton: {
    borderColor: "#123D1F",
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#123D1F",
  },
});
