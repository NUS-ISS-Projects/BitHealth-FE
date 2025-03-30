import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { auth } from "../firebase"; // Adjust the path if necessary
import colors from "../theme/colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ROUTES = {
  doctor: "/doctor/dashboard",
  patient: "/patient",
};

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

// Retrieve data securely
const getData = async (key: string) => {
  if (Platform.OS === "web") {
    // Use localStorage for web
    return localStorage.getItem(key);
  } else {
    // Use expo-secure-store for mobile
    return await SecureStore.getItemAsync(key);
  }
};

const USER_BASE_URL = process.env.EXPO_PUBLIC_USER_BASE_URL;
const ROUTES = {
  doctor: "/doctor/dashboard",
  patient: "/patient",
};
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userType } = useLocalSearchParams();

  // Handle Email/Password Login
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Perform Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      console.log("Logged in user:", user);

      // Store the token securely
      storeData("authToken", idToken);

      // Redirect based on user type and pass userData
      redirectToRoute(userType);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Invalid username/email or password."
      );
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to the appropriate route based on user type
  const redirectToRoute = (userType: string | number | string[]) => {
    router.push({
      pathname: ROUTES[userType],
      // Pass userData as a stringified JSON object
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant='headlineMedium' style={styles.welcomeText}>
          Welcome Back!
        </Text>
      </View>

      {/* Login Form */}
      <TextInput
        label='Username or Email'
        mode='outlined'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
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
        <TouchableOpacity style={styles.socialButton}>
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
    justifyContent: "center", // Center content vertically
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  welcomeText: {
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
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
});
