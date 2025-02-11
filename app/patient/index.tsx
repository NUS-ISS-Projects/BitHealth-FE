import { View, Text, ScrollView } from "react-native";
import CustomButton from "../components/CustomButton";
import DoctorCard from "../components/DoctorCard";
import { useRouter } from "expo-router";
import colors from "../theme/colors";

const doctors = [
  {
    name: "Dr. Budi Sound",
    specialty: "Aesthetic Doctor",
    rating: 5.0,
    reviews: 780,
    image: "https://via.placeholder.com/50",
  },
  {
    name: "Dr. Sober Roam",
    specialty: "Aesthetic Doctor",
    rating: 4.9,
    reviews: 422,
    image: "https://via.placeholder.com/50",
  },
];

export default function PatientHome() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}
    >
      <Text
        style={{ fontSize: 22, fontWeight: "bold", color: colors.textPrimary }}
      >
        Hello, Aceng Racing! 👋
      </Text>
      <View
        style={{
          backgroundColor: colors.cardBackground,
          padding: 20,
          borderRadius: 10,
          marginVertical: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>
          No booking schedule
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
          Seems like you do not have any appointment scheduled today.
        </Text>
        <CustomButton
          title='Make Appointment'
          onPress={() => router.push("/patient/book")}
        />
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: colors.textPrimary,
          marginBottom: 10,
        }}
      >
        Recent Appointments
      </Text>
      {doctors.map((doc, index) => (
        <DoctorCard
          key={index}
          doctor={doc}
          onPress={() => router.push("/patient/book")}
        />
      ))}
    </ScrollView>
  );
}
