// src/screens/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Button, Text, TextInput, IconButton } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import colors from "../theme/colors";
import { FontAwesome } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userType } = useLocalSearchParams();

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Validate fields
      if (!username || !email || !password) {
        throw new Error("Please fill in all fields.");
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Build payload for your backend registration
      const payload = {
        name: username,
        email: email,
        role: "PATIENT", // or "DOCTOR" based on your app logic
        firebaseUid: user.uid,
      };

      const response = await axios.post(
        `${API_URL}/api/users/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.data) {
        throw new Error("Registration failed on backend.");
      }

      // Redirect to login page once both Firebase and backend registration are successful
      // navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to register. Please try again."
      );
      console.error("Registration Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.backButtonContainer}>
          <IconButton
            icon='arrow-left'
            iconColor={colors.primary}
            size={24}
            onPress={() => router.back()}
          />
        </View>
        <Text variant='headlineMedium' style={styles.welcomeText}>
          Create a {userType === "doctor" ? "Doctor" : "Patient"} account
        </Text>
      </View>
      <TextInput
        label='Username'
        mode='outlined'
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize='none'
      />
      <TextInput
        label='Email'
        mode='outlined'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize='none'
      />
      <TextInput
        label='Password'
        mode='outlined'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        right={<TextInput.Icon icon='eye' />}
      />
      <Button
        mode='contained'
        onPress={handleRegister}
        disabled={loading}
        style={styles.registerButton}
        labelStyle={styles.registerButtonText}
      >
        {loading ? "Registering..." : "Register"}
      </Button>
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text
          style={styles.loginLink}
          onPress={() =>
            router.push({
              pathname: "/auth/login",
              params: { userType },
            })
          }
        >
          Login
        </Text>
      </Text>
      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>or continue with</Text>
        <View style={styles.separator} />
      </View>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <View style={styles.socialContentContainer}>
            <View style={styles.socialIconContainer}>
              <FontAwesome name='google' size={20} color='#DB4437' />
            </View>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  headerImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitleText: {
    color: colors.textSecondary,
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    marginVertical: 20,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loginText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: 20,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  separatorText: {
    color: colors.textSecondary,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
  },
  socialContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  socialIconContainer: {
    width: 30,
    alignItems: "flex-start",
  },
  socialButtonText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "800",
    textAlign: "center",
    paddingRight: 30,
  },
  backButtonContainer: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
});

export default RegisterScreen;
