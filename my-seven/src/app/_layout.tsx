import { Stack } from 'expo-router';
import '../global.css';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
