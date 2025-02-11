import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the Doctor Appointment App</Text>
      <Button
        title='Book Appointment'
        onPress={() => router.push("/patient/book")}
      />
      <Button
        title='Doctor Dashboard'
        onPress={() => router.push("/doctor/dashboard")}
      />
    </View>
  );
}
