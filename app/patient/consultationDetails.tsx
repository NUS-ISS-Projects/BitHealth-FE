import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, Divider, IconButton } from "react-native-paper";
import colors from "../theme/colors";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";
import DiagnosisSection from "../components/diagnosisCard";
import MedicalCertificate from "../components/mcCard";
import MedicationSection from "../components/medicationCard";
import Receipt from "../components/receiptCard";

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

type AppointmentParams = {
  appointmentId?: string;
  doctorName: string;
  specialty: string;
  reason?: string;
  checkupType?: string;
  appointmentDate: string;
  appointmentTime: string;
};

export default function ConsultationDetails() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedTab, setSelectedTab] = useState<TabKey>(TabKey.DIAGNOSIS);
  const route = useRoute();
  const {
    appointmentId,
    doctorName,
    specialty,
    appointmentDate,
    appointmentTime,
  } = route.params as AppointmentParams;

  const handleTabPress = (tab: TabKey) => {
    setSelectedTab(tab);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case TabKey.DIAGNOSIS:
        return (
          <DiagnosisSection
            appointmentId={appointmentId ? parseInt(appointmentId, 10) : 0}
          />
        );
      case TabKey.MEDICATION:
        return (
          <MedicationSection
            appointmentId={appointmentId ? parseInt(appointmentId, 10) : 0}
          />
        );
      case TabKey.MEDICAL_CERT:
        return (
          <MedicalCertificate
            appointmentId={appointmentId ? parseInt(appointmentId, 10) : 0}
          />
        );
      case TabKey.RECEIPT:
        return (
          <Receipt
            appointmentId={appointmentId ? parseInt(appointmentId, 10) : 0}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Doctor Info */}
      <View style={styles.headerBarContainer}>
        <IconButton
          mode='contained'
          icon='arrow-left'
          iconColor='#123D1F'
          containerColor='white'
          size={18}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerBar}>
          {appointmentDate} • {appointmentTime}
        </Text>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.consultationInfo}>
          <Image
            source={require("../../assets/images/bithealth-logo.png")}
            style={styles.doctorImage}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.consultationSpeciality}>{specialty}</Text>
            <Text style={styles.consultationID}>
              Consultation #: {appointmentId}
            </Text>
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
    height: 50,
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
    color: "#000000",
    fontWeight: "bold",
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
