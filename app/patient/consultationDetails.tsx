import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, Button, Divider, IconButton } from "react-native-paper";
import colors from "../theme/colors";
import { useNavigation, NavigationProp } from "@react-navigation/native";

enum TabKey {
  DIAGNOSIS = "Diagnosis",
  MEDICATION = "Medication",
  MEDICAL_CERT = "Medical Certificate",
  RECEIPT = "Receipt",
}

const iconMapping: Record<string, string> = {
  [TabKey.DIAGNOSIS]: "bacteria-outline",
  [TabKey.MEDICATION]: "pill",
  [TabKey.MEDICAL_CERT]: "shield-check-outline",
  [TabKey.RECEIPT]: "account-cash-outline",
};

export default function ConsultationDetails() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedTab, setSelectedTab] = useState<TabKey>(TabKey.DIAGNOSIS);

  const handleTabPress = (tab: TabKey) => {
    setSelectedTab(tab);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case TabKey.DIAGNOSIS:
        return (
          <View>
            <Text style={styles.sectionHeading}>Diagnosis</Text>
            <Text style={styles.sectionTitle}>Your Diagnosis</Text>
            <Text style={styles.bodyText}>
              J06.9 – Acute upper respiratory infection, unspecified
            </Text>
            <Text style={styles.sectionTitle}>What You Should Do</Text>
            <Text style={styles.bodyText}>
              Take a good rest and get well soon!
            </Text>
          </View>
        );
      case TabKey.MEDICATION:
        return (
          <View>
            <Text style={styles.sectionHeading}>Medication</Text>
            <Text style={styles.bodyText}>
              1) Paracetamol 500mg – 3 times a day
              {"\n"}2) Lozenges – 3 times a day
            </Text>
          </View>
        );
      case TabKey.MEDICAL_CERT:
        return (
          <View>
            <Text style={styles.sectionHeading}>Medical Certificate</Text>
            <Text style={styles.bodyText}>
              MC Number: MC/123456
              {"\n"}Issued: 17 Dec 2024
              {"\n"}Validity: 2 days
            </Text>
          </View>
        );
      case TabKey.RECEIPT:
        return (
          <View>
            <Text style={styles.sectionHeading}>Receipt</Text>
            <Text style={styles.bodyText}>
              Consultation Fee: $25.00
              {"\n"}Medication Fee: $10.00
              {"\n"}Total: $35.00
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Doctor & Patient Info */}
      <View style={styles.headerBarContainer}>
        <IconButton
          mode='contained'
          icon='arrow-left'
          iconColor='#123D1F'
          containerColor='white'
          size={18}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerBar}>17 Dec 2024 • 8:33 AM</Text>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.consultationInfo}>
          <Image
            source={require("../../assets/images/bithealth-logo.png")}
            style={styles.doctorImage}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr Eugene Huang</Text>
            <Text style={styles.consultationSpeciality}>
              General Practitioner
            </Text>
            <Text style={styles.consultationID}>Consultation #: 1</Text>
          </View>
        </View>
      </View>

      <Divider style={{ marginVertical: 15 }} />

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        {Object.values(TabKey).map((tab) => {
          const iconName = iconMapping[tab] || "camera";
          return (
            <View key={tab} style={styles.tabItem}>
              <IconButton
                icon={iconName}
                mode='contained'
                onPress={() => handleTabPress(tab)}
                iconColor={selectedTab === tab ? "#FFFFFF" : "#000000"}
                style={[
                  styles.tabButton,
                  selectedTab === tab && styles.activeTabButton,
                ]}
              />
              <Text
                style={[
                  styles.tabLabel,
                  selectedTab === tab
                    ? styles.activeTabLabel
                    : styles.inactiveTabLabel,
                ]}
              >
                {tab}
              </Text>
            </View>
          );
        })}
      </View>

      <Divider style={{ marginVertical: 15 }} />
      <View style={styles.contentContainer}>{renderContent()}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    padding: 20,
  },
  headerBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  headerBar: {
    fontSize: 15,
    fontWeight: "regular",
    color: colors.primary,
    paddingLeft: 50,
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  doctorSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  consultationInfo: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  consultationSpeciality: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  consultationID: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabItem: {
    alignItems: "center",
    width: "25%",
    paddingHorizontal: 4,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  tabButton: {
    marginVertical: 5,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  activeTabLabel: {
    fontSize: 12,
  },
  inactiveTabLabel: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  contentContainer: {
    marginTop: 10,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.textPrimary,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.textPrimary,
    paddingTop: 10,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 5,
  },
});
