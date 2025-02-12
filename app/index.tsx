import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome</Text>
      <View style={{ padding: 20 }}>
        <Button
          title='I am a Patient'
          onPress={() => router.push("/patient")}
        />
      </View>
      <Button
        title='I am a Doctor'
        onPress={() => router.push("/doctor/dashboard")}
      />
    </View>
  );
}
