import { View, Text } from "react-native";
import CustomButton from "../components/CustomButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import colors from "../theme/colors";

export default function ConfirmAppointment() {
  const { doctor } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <Text
        style={{ fontSize: 22, fontWeight: "bold", color: colors.textPrimary }}
      >
        Does everything look correct?
      </Text>
      <Text style={{ fontSize: 16, color: colors.textSecondary }}>
        Doctor: {doctor}
      </Text>
      <CustomButton
        title='Book Now'
        onPress={() => router.push({ pathname: "/patient/appointments" })}
      />
    </View>
  );
}
