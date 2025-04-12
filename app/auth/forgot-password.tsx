import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Button, Text, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import colors from "../theme/colors";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      if (Platform.OS === "web") {
        window.alert("Please enter your email address.");
      } else {
        Alert.alert("Error", "Please enter your email address.");
      }
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      if (Platform.OS === "web") {
        window.alert("Password reset link has been sent to your email.");
      } else {
        Alert.alert(
          "Success",
          "Password reset link has been sent to your email."
        );
      }
      router.push("/auth/login");
    } catch (error: any) {
      const errorMessage =
        error.message || "Something went wrong. Please try again.";
      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setLoading(false);
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
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Forgot Password</Text>
        <Text style={styles.subText}>
          Enter your email address below and we'll send you a link to reset your
          password.
        </Text>
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
          textColor='black'
        />
        <Button
          mode='contained'
          style={styles.resetButton}
          labelStyle={styles.resetButtonText}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Sending..." : "Reset Password"}
        </Button>
      </View>
    </ScrollView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  backButtonContainer: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    width: "100%",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
});
