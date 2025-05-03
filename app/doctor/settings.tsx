import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
import colors from "../theme/colors";

import { API_URL } from "@/configs/config";

export default function DoctorSettings() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState<number | null>(null); // Store doctor ID dynamically
  const router = useRouter();

  // Cross-platform function to clear authentication token
  const clearAuthToken = async () => {
    try {
      if (Platform.OS === "web") {
        // Use localStorage for web
        localStorage.removeItem("authToken");
      } else {
        // Use SecureStore for mobile
        await SecureStore.deleteItemAsync("authToken");
      }
    } catch (error) {
      console.error("Error clearing auth token:", error);
      throw error; // Re-throw the error for handling in the calling function
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Clear the authentication token
      await clearAuthToken();
      // Navigate to the login screen
      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const getData = async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };

  useEffect(() => {
    const loadDoctorData = async () => {
      setLoading(true);
      try {
        const token = await getData("authToken");
        if (!token) {
          console.error("No authentication token found.");
          return;
        }
        
        const doctorData = await fetchDoctorSettings(token); // Pass doctor ID to fetch settings
        console.log(doctorData);
        setDoctorId(doctorData.doctorId || "");
        setFullName(doctorData.user.name || "");
        setEmail(doctorData.user.email || "");
        setSpecialty(doctorData.specialization || "");

        if (doctorData.avatar) {
          if (
            doctorData.avatar.startsWith("data:image") &&
            doctorData.avatar.includes("http")
          ) {
            setAvatar(null);
          } else {
            setAvatar(
              doctorData.avatar.startsWith("data:image")
                ? doctorData.avatar
                : `data:image/jpeg;base64,${doctorData.avatar}`
            );
          }
        }
      } catch (error) {
        console.error("Failed to load doctor data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDoctorData();
  }, []);

  async function fetchDoctorSettings(token: any) {
    try {
         // Fetch doctor profile
         const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { userId } = profileResponse.data;
        const response = await axios.get(`${API_URL}/api/doctors/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor settings:", error);
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
    console.log("save triggered");
    if (!doctorId) {
      Alert.alert("Error", "Doctor ID not available. Please try again.");
      return;
    }
    try {
      const token = await getData("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const updateData = {
        name: fullName,
        email: email,
        specialization: specialty,
        avatar: avatar,
      };
      console.log(updateData);
      const response = await axios.put(
        `${API_URL}/api/doctors/${doctorId}`, // Use doctorId in the endpoint
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
      Alert.alert("Error", "Failed to update profile");
    } 
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase());
    return initials.join("").substring(0, 2);
  };

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Settings</Text>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Avatar.Image
              size={100}
              source={{ uri: avatar }}
              onError={() => setAvatar(null)}
            />
          ) : (
            <Avatar.Text size={100} label={getInitials(fullName)} />
          )}
          <TouchableOpacity
            style={styles.editAvatar}
            onPress={handleAvatarSelect}
          >
            <Text style={styles.editAvatarText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          theme={{
            colors: {
              primary: "white",
            },
          }}
        />
        <TextInput
          label="Specialty"
          value={specialty}
          onChangeText={setSpecialty}
          style={styles.input}
          theme={{
            colors: {
              primary: "white",
            },
          }}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          theme={{
            colors: {
              primary: "white",
            },
          }}
        />

        {/* Save Button */}
        <Button
          mode="contained"
          style={styles.saveButton}
          labelStyle={styles.saveButtonText}
          onPress={handleSave}
        >
          Save Changes
        </Button>

        {/* Logout Button */}
        <Button
          mode="outlined"
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
    backgroundColor: colors.background,
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
  logoutButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
});