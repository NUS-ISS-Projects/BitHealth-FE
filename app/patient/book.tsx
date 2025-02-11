import { Text, ScrollView } from "react-native";
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

export default function SelectDoctor() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}
    >
      <Text
        style={{ fontSize: 22, fontWeight: "bold", color: colors.textPrimary }}
      >
        Choose the doctor
      </Text>
      {doctors.map((doc, index) => (
        <DoctorCard
          key={index}
          doctor={doc}
          onPress={() =>
            router.push({
              pathname: "/patient/appointments",
              //   query: { doctor: doc.name },
            })
          }
        />
      ))}
    </ScrollView>
  );
}
