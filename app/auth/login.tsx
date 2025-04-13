import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput, IconButton } from "react-native-paper";
import colors from "../theme/colors";
import { auth } from "../../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
import axios from "axios";

// Store data securely
const storeData = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    // Use localStorage for web
    localStorage.setItem(key, value);
  } else {
    // Use expo-secure-store for mobile
    await SecureStore.setItemAsync(key, value);
  }
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { userType } = useLocalSearchParams();
  // Configure Google Auth Request
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      responseType: "token",
      webClientId: process.env.EXPO_PUBLIC_WEBCLIENT,
    });

  // Handle Email/Password Login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      storeData("authToken", idToken);
      // Fetch the user profile from the backend
      const response = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const localUser = await response.json();
      if (userType === "doctor" && localUser.role !== "DOCTOR") {
        if (Platform.OS === "web") {
          window.alert("Access Denied! This account is not a doctor account.");
        } else {
          Alert.alert("Access Denied", "This account is not a doctor account.");
        }
        setLoading(false);
        return;
      } else if (userType === "patient" && localUser.role !== "PATIENT") {
        if (Platform.OS === "web") {
          window.alert("Access Denied! This account is not a patient account.");
        } else {
          Alert.alert(
            "Access Denied",
            "This account is not a patient account."
          );
        }
        setLoading(false);
        return;
      }
      const destination =
        userType === "doctor" ? "/doctor/dashboard" : "/patient/home";
      router.replace(destination);
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("Login Error: Invalid email or password.");
      } else {
        Alert.alert("Login Error", "Invalid email or password.");
      }
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
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        storeData("authToken", idToken);

        // Fetch the user profile from the backend
        const response = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        let localUser;
        // Check if the user exists in the backend, If not, register the user
        if (response.ok) {
          localUser = await response.json();
        } else if (response.status === 404) {
          const payload = {
            name: user.displayName || "",
            email: user.email || "",
            role: userType === "doctor" ? "DOCTOR" : "PATIENT",
            firebaseUid: user.uid,
          };
          const regResponse = await axios.post(
            `${API_URL}/api/users/register`,
            payload,
            { headers: { "Content-Type": "application/json" } }
          );
          localUser = regResponse.data;
        } else {
          throw new Error("Failed to fetch user profile");
        }

        if (userType === "doctor" && localUser.role !== "DOCTOR") {
          if (Platform.OS === "web") {
            window.alert(
              "Access Denied! This account is not a doctor account."
            );
          } else {
            Alert.alert(
              "Access Denied",
              "This account is not a doctor account."
            );
          }
          setLoading(false);
          return;
        } else if (userType === "patient" && localUser.role !== "PATIENT") {
          if (Platform.OS === "web") {
            window.alert(
              "Access Denied! This account is not a patient account."
            );
          } else {
            Alert.alert(
              "Access Denied",
              "This account is not a patient account."
            );
          }
          setLoading(false);
          return;
        }

        const destination =
          userType === "doctor" ? "/doctor/dashboard" : "/patient/home";
        router.replace(destination);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Google login error.";
      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
      console.error("Google Login Error:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backButtonContainer}>
        <IconButton
          icon='arrow-left'
          iconColor={colors.primary}
          size={24}
          onPress={() => router.back()}
        />
      </View>
      <View style={styles.headerContainer}>
        <Image
          source={
            userType === "doctor"
              ? require("../../assets/images/doctor-login.jpg")
              : require("../../assets/images/patient-login.jpg")
          }
          style={styles.headerImage}
          resizeMode='contain'
        />
        <Text variant='headlineMedium' style={styles.welcomeText}>
          Welcome Back!
        </Text>
        <Text variant='titleMedium' style={styles.subtitleText}>
          Login as {userType === "doctor" ? "Doctor" : "Patient"}
        </Text>
      </View>

      {/* Login Form */}
      <TextInput
        label='Email'
        mode='outlined'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize='none'
        theme={{
          colors: {
            primary: colors.primary,
          },
        }}
        textColor={colors.primary}
      />
      <TextInput
        label='Password'
        mode='outlined'
        secureTextEntry={!isPasswordVisible}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? "eye" : "eye-off"}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
        theme={{
          colors: {
            primary: colors.primary,
          },
        }}
        textColor={colors.primary}
      />

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        mode='contained'
        style={styles.loginButton}
        labelStyle={styles.loginButtonText}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      {/* Social Login */}
      <Text style={styles.orText}>Or, login with</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignIn}
        >
          <FontAwesome name='google' size={24} color='#DB4437' />
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <Text style={styles.registerText}>
        New to this platform?{" "}
        <Text
          style={styles.registerLink}
          onPress={() =>
            router.push({
              pathname: "/auth/register",
              params: { userType },
            })
          }
        >
          Register
        </Text>
      </Text>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 60,
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
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  orText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  registerText: {
    textAlign: "center",
    color: colors.textSecondary,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
  backButtonContainer: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: colors.primary,
    textAlign: "right",
    marginBottom: 15,
    fontWeight: "bold",
  },
});
