import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          headerTintColor: '#111827',
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: '#F2F2F7',
          },
        }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
