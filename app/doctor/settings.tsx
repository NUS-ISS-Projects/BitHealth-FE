import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, TextInput, Button, Avatar } from "react-native-paper";
import colors from "../theme/colors";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function DoctorSettings() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: fullName,
        email: email,
        specialization: specialty,
        avatar: avatar,
      };

      const response = await axios.put(`${API_URL}/api/doctors/1`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

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

  useEffect(() => {
    const loadDoctorData = async () => {
      setLoading(true);
      try {
        const doctorData = await fetchDoctorSettings(1);
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
        console.error("Failed to load patient data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDoctorData();
  }, []);

  async function fetchDoctorSettings(doctorId: number) {
    try {
      const response = await axios.get(`${API_URL}/api/doctors/${doctorId}`);
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
          label='Full Name'
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
          label='Specialty'
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
          label='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          style={styles.input}
          theme={{
            colors: {
              primary: "white",
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
});
