import React, { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import colors from "../theme/colors";

export default function DoctorSettings() {
  const router = useRouter();

  // Example state fields for the doctor's profile
  const [fullName, setFullName] = useState("Dr. Budi Sound");
  const [email, setEmail] = useState("budi@example.com");
  const [phone, setPhone] = useState("+62 812 3456 7890");
  const [specialty, setSpecialty] = useState("Aesthetic Doctor");

  const handleSave = () => {
    // Implement your save logic here (e.g., API call)
    console.log("Profile saved", { fullName, email, phone, specialty });
    // Optionally navigate back to the dashboard or show a confirmation message
    router.push("/doctor/dashboard");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Settings</Text>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={100}
          source={require("../../assets/images/favicon.png")}
        />
        <TouchableOpacity style={styles.editAvatar}>
          <Text style={styles.editAvatarText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <TextInput
        label='Full Name'
        mode='outlined'
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        label='Email'
        mode='outlined'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        style={styles.input}
      />
      <TextInput
        label='Phone Number'
        mode='outlined'
        value={phone}
        onChangeText={setPhone}
        keyboardType='phone-pad'
        style={styles.input}
      />
      <TextInput
        label='Specialty'
        mode='outlined'
        value={specialty}
        onChangeText={setSpecialty}
        style={styles.input}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // e.g., soft beige or white
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
