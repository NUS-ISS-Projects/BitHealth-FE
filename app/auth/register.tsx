import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../theme/colors";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { userType } = useLocalSearchParams();

  const handleRegister = () => {
    router.push(userType === "doctor" ? "/doctor/dashboard" : "/patient");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant='headlineMedium' style={styles.welcomeText}>
          Create a {userType === "doctor" ? "Doctor" : "Patient"} account
        </Text>
      </View>

      {/* Registration Form */}
      <TextInput
        label='Email ID'
        mode='outlined'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType='email-address'
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
        style={styles.registerButton}
        labelStyle={styles.registerButtonText}
        onPress={handleRegister}
      >
        Register
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
        <TouchableOpacity style={styles.socialButton}>
          <View style={styles.socialContentContainer}>
            <View style={styles.socialIconContainer}>
              <FontAwesome name='google' size={20} color='#DB4437' />
            </View>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <View style={styles.socialContentContainer}>
            <View style={styles.socialIconContainer}>
              <FontAwesome name='facebook' size={20} color='#4267B2' />
            </View>
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
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
