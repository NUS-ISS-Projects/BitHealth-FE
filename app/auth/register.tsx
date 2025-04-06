import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as Google from "expo-auth-session/providers/google";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import colors from "../theme/colors";
WebBrowser.maybeCompleteAuthSession();

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ROUTES = {
  doctor: "/doctor/dashboard",
  patient: "/patient",
};
const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userType } = useLocalSearchParams();

  const auth = getAuth();

  // Configure Google Auth
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEBCLIENT, // Replace with your Google Client ID
    responseType: "token",
  });

  // Handle Email/Password Registration
  const handleRegister = async () => {
    setLoading(true);
    try {
      // Validate inputs
      if (!email || !password || !username) {
        throw new Error("Please fill in all fields.");
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

       //Register user in supabase
       const userData = {
        name: username || "No Name", // Use display name or fallback
        email: email,
        password: "GooglePass", // Use the Google ID token as the password (optional)
        role: userType, // Pass the user type (doctor/patient)
      };

      console.log("Sending payload:", userData);

      const response = await axios.post(`${API_URL}/api/users/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response data:", response.data);

      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error("Registration has failed.");
    }

    const responseData = response.data;
   
      // Redirect based on user type
      router.push({
        pathname: ROUTES[userType],
        params: { userData: JSON.stringify(responseData) }, // Pass userData as a stringified JSON object
      });
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to register. Please try again.");
      console.error("Registration Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await googlePromptAsync();
      if (result.type === "success") {
        const { id_token } = result.params;

        // Create a Google credential
        const credential = GoogleAuthProvider.credential(id_token);
          
        // Sign in with Firebase
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        console.log("User signed in with Google:", user);

        //Register user in supabase
       const userData = {
        name: username || "No Name", // Use display name or fallback
        email: email,
        password: "GooglePass", // Use the Google ID token as the password (optional)
        role: userType, // Pass the user type (doctor/patient)
      };

        // Redirect based on user type
        router.push({
          pathname: ROUTES[userType],
          params: { userData: JSON.stringify(userData) }, // Pass userData as a stringified JSON object
        });
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to sign in with Google.");
      console.error("Google Sign-In Error:", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.welcomeText}>
          Create a {userType === "doctor" ? "Doctor" : "Patient"} account
        </Text>
      </View>

      {/* Registration Form */}
      <TextInput
        label="Username"
        mode="outlined"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Email ID"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        right={<TextInput.Icon icon="eye" />}
      />

      <Button
        mode="contained"
        style={styles.registerButton}
        labelStyle={styles.registerButtonText}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </Button>

      {/* Login Link */}
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
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
          <View style={styles.socialContentContainer}>
            <View style={styles.socialIconContainer}>
              <FontAwesome name="google" size={20} color="#DB4437" />
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
  welcomeText: {
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
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
});

export default RegisterScreen;