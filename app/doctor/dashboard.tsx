import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function DoctorDashboard() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Doctor Dashboard</Text>
      <Button
        title="View Today's Patients"
        onPress={() => router.push("/doctor/patients")}
      />
    </View>
  );
}
