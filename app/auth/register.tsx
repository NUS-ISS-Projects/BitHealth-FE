import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import colors from "../theme/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();
import { makeRedirectUri } from "expo-auth-session";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userType } = useLocalSearchParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const redirectUri = makeRedirectUri({});

  // Configure Google Auth
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      redirectUri,
      webClientId: process.env.EXPO_PUBLIC_WEBCLIENT,
      responseType: "token",
      usePKCE: false,
    });

  // Handle Email/Password Registration
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

      // Redirect to login page once registration is successful
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
        const payload = {
          name: user.displayName || "",
          email: user.email || "",
          role: userType === "doctor" ? "DOCTOR" : "PATIENT",
          firebaseUid: user.uid,
        };

        try {
          await axios.post(`${API_URL}/api/users/register`, payload, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          // If the error indicates the user is already registered, we ignore it.
          if (!(error.response && error.response.status === 409)) {
            throw error;
          }
        }
        const destination =
          userType === "doctor" ? "/doctor/dashboard" : "/patient/home";
        if (window.opener) {
          window.opener.location.href = destination;
          window.close();
        } else {
          router.replace(destination);
        }
        WebBrowser.dismissBrowser();
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign in with Google.";
      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
      console.error("Google Sign-In Error:", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
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
        keyboardType='email-address'
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
        style={styles.registerButton}
        labelStyle={styles.registerButtonText}
        onPress={handleRegister}
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
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignIn}
        >
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
});

export default RegisterScreen;
