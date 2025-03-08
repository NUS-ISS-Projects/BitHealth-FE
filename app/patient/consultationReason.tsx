import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  TextInput,
  Button,
  IconButton,
  List,
} from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import colors from "../theme/colors";

const checkupTypes = [
  {
    specialty: "General Practitioner",
    icon: "doctor",
    options: [
      { id: "GP1", name: "Annual Health Screening" },
      { id: "GP2", name: "General Check-up" },
      { id: "GP3", name: "Vaccination" },
      { id: "GP4", name: "Other Health Concerns" },
    ],
  },
  {
    specialty: "Dermatology",
    icon: "face-man",
    options: [
      { id: "DERM1", name: "Skin Health Screening" },
      { id: "DERM2", name: "Acne Assessment" },
      { id: "DERM3", name: "Skin Cancer Screening" },
    ],
  },
  {
    specialty: "Cardiology",
    icon: "heart-pulse",
    options: [
      { id: "CARD1", name: "Heart Health Screening" },
      { id: "CARD2", name: "Blood Pressure Check" },
      { id: "CARD3", name: "Cholesterol Assessment" },
    ],
  },
];

export default function ConsultationReason() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [reason, setReason] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [expandedSpecialty, setExpandedSpecialty] = useState("");

  const handleContinue = () => {
    navigation.navigate("Book");
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          <Text style={styles.accordionHeader}>Select Type of Check-up</Text>
          {checkupTypes.map((specialty) => (
            <List.Accordion
              key={specialty.specialty}
              title={specialty.specialty}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={specialty.icon}
                  color={colors.primary}
                />
              )}
              expanded={expandedSpecialty === specialty.specialty}
              onPress={() =>
                setExpandedSpecialty(
                  expandedSpecialty === specialty.specialty
                    ? ""
                    : specialty.specialty
                )
              }
              style={styles.accordion}
              titleStyle={styles.accordionTitle}
            >
              {specialty.options.map((option) => (
                <List.Item
                  key={option.id}
                  title={option.name}
                  onPress={() => handleOptionSelect(option.id)}
                  style={[
                    styles.optionItem,
                    selectedOption === option.id && styles.selectedOption,
                  ]}
                  titleStyle={[
                    styles.optionTitle,
                    selectedOption === option.id && styles.selectedOptionTitle,
                  ]}
                  left={(props) =>
                    selectedOption === option.id && (
                      <List.Icon
                        {...props}
                        icon='check'
                        color={colors.primary}
                      />
                    )
                  }
                />
              ))}
            </List.Accordion>
          ))}
          <View style={styles.divider} />

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
        style={[styles.button, !selectedOption && styles.buttonDisabled]}
        onPress={handleContinue}
        labelStyle={styles.buttonLabel}
        disabled={!selectedOption}
      >
        Continue
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 30,
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
  accordionHeader: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  accordion: {
    backgroundColor: colors.cardBackground,
  },
  accordionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  optionItem: {
    backgroundColor: colors.background,
  },
  selectedOption: {
    backgroundColor: `${colors.primary}15`,
  },
  optionTitle: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  selectedOptionTitle: {
    color: colors.primary,
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 15,
  },
});
