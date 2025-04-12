// src/screens/RegisterScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { auth } from "../../firebaseConfig";
import colors from "../theme/colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userType } = useLocalSearchParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (!name || !email || !password) {
        throw new Error("Please fill in all fields.");
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const payload = {
        name: name,
        email: email,
        role: userType === "doctor" ? "DOCTOR" : "PATIENT",
        firebaseUid: user.uid,
      };
      console.log(payload);
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      if (!response.data) {
        throw new Error("Registration failed on backend.");
      }
      router.push("/auth/login");
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/email-already-in-use"
          ? "This email is already registered. Please use a different email."
          : error.message || "Failed to register. Please try again.";

      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
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
        label='Name'
        mode='outlined'
        value={name}
        onChangeText={setName}
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
