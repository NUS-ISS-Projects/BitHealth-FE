import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, TextInput, Button, IconButton } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import colors from "../theme/colors";

export default function ConsultationReason() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [reason, setReason] = useState("");

  const handleContinue = () => {
    navigation.navigate("Book");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBarContainer}>
        <IconButton
          mode='contained'
          icon='arrow-left'
          iconColor={colors.primary}
          containerColor='white'
          size={18}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerBar}>Consultation Details</Text>
      </View>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>What's the reason</Text>
          <Text style={styles.header}>for your visit?</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>1/4</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>
            Please provide a brief description of your symptoms or reason for
            consultation
          </Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            mode='outlined'
            multiline
            numberOfLines={6}
            style={styles.input}
            theme={{
              colors: {
                primary: colors.primary,
              },
            }}
          />
        </Card.Content>
      </Card>

      <Button
        mode='contained'
        style={styles.button}
        onPress={handleContinue}
        labelStyle={styles.buttonLabel}
      >
        Continue
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  headerBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerBar: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
    paddingLeft: 56,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressContainer: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.cardBackground,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.cardBackground,
    marginBottom: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    marginTop: 10,
  },
  buttonLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
