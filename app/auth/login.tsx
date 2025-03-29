import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "../theme/colors";
import { FontAwesome } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { userType } = useLocalSearchParams();

  // Handle Login
  const handleLogin = () => {
    router.push(userType === "doctor" ? "/doctor/dashboard" : "/patient");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={
            userType === "doctor"
              ? require("../../assets/images/doctor-login.jpg") // Image for doctor
              : require("../../assets/images/patient-login.jpg") // Image for patient
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
        label='Email ID'
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
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot?</Text>
      </TouchableOpacity>

      <Button
        mode='contained'
        style={styles.loginButton}
        labelStyle={styles.loginButtonText}
        onPress={handleLogin}
      >
        Login
      </Button>

      {/* Social Login */}
      <Text style={styles.orText}>Or, login with</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name='facebook' size={24} color='#4267B2' />
        </TouchableOpacity>
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
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  forgotText: {
    textAlign: "right",
    color: colors.primary,
    marginBottom: 20,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
