import React from "react";
import { View, Image, ScrollView } from "react-native";
import { Text, Button, Card, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import colors from "../theme/colors";

const appointments = [
  {
    name: "Dr. Budi Sound",
    location: "Komuk Express Semarang",
    date: "21 May",
    image: require("../../assets/images/favicon.png"),
  },
  {
    name: "Dr. Anastasia",
    location: "Komuk Express Bali",
    date: "17 May",
    image: require("../../assets/images/favicon.png"),
  },
];

export default function PatientHome() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF", padding: 20 }}>
      <View style={{ paddingBottom: 20 }}>
        {/* Header Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Image
            source={require("../../assets/images/bithealth-logo.png")}
            style={{ width: 50, height: 50 }}
          />
          <Text
            variant='titleLarge'
            style={{ fontWeight: "bold", color: "black" }}
          >
            BitHealth
          </Text>
        </View>
        <View style={{ paddingBottom: 20, paddingLeft: 10 }}>
          <Text
            variant='titleSmall'
            style={{ fontWeight: "bold", color: "grey" }}
          >
            Hello,
          </Text>
          <Text
            variant='titleLarge'
            style={{ fontWeight: "bold", color: colors.primary }}
          >
            Jong Yann! 👋
          </Text>
        </View>

        <Card
          style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 10,
            paddingVertical: 20,
          }}
        >
          <Card.Content style={{ alignItems: "center" }}>
            <Image
              source={require("../../assets/images/patient-home.png")}
              style={{ width: 300, height: 200 }}
            />
            <Text
              variant='titleMedium'
              style={{
                fontWeight: "bold",
                color: colors.primary,
                paddingBottom: 10,
              }}
            >
              No booking schedule
            </Text>
            <Text
              variant='bodyMedium'
              style={{
                color: colors.textSecondary,
                textAlign: "center",
                paddingBottom: 10,
              }}
            >
              Seems like you do not have any appointment scheduled today.
            </Text>
            <Button
              mode='contained'
              style={{ marginTop: 15, backgroundColor: colors.primary }}
              onPress={() => router.push("/patient/book")}
            >
              Make appointment
            </Button>
          </Card.Content>
        </Card>

        {/* Recent Appointments */}
        <View style={{ paddingVertical: 20 }}>
          <Text
            variant='titleMedium'
            style={{
              fontWeight: "bold",
              color: colors.textPrimary,
            }}
          >
            Recent Appointments
          </Text>
        </View>

        {appointments.map((appointment, index) => (
          <Card
            key={index}
            style={{
              backgroundColor: colors.cardBackground,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <Card.Content
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Avatar.Image size={50} source={appointment.image} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    variant='titleSmall'
                    style={{ fontWeight: "bold", color: colors.primary }}
                  >
                    {appointment.name}
                  </Text>
                  <Text variant='labelMedium' style={{ color: colors.primary }}>
                    {appointment.date}
                  </Text>
                </View>
                <Text
                  variant='bodySmall'
                  style={{ color: colors.textSecondary }}
                >
                  {appointment.location}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
