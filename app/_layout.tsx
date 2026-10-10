import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { colors } from '@/shared/constants/colors';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Cormorant400: require('../tarot-design-kit/fonts/cormorant-garamond-400.ttf'),
    Cormorant500: require('../tarot-design-kit/fonts/cormorant-garamond-500.ttf'),
    Cormorant600: require('../tarot-design-kit/fonts/cormorant-garamond-600.ttf'),
    Inter400: require('../tarot-design-kit/fonts/inter-400.ttf'),
    Inter500: require('../tarot-design-kit/fonts/inter-500.ttf'),
    Inter600: require('../tarot-design-kit/fonts/inter-600.ttf'),
  });
  if (!loaded && !error) return <View style={styles.loading} accessibilityState={{ busy: true }}>
    <StatusBar style="light" />
    <ActivityIndicator color={colors.primary} accessibilityLabel="Загрузка приложения" />
  </View>;
  return <>
    {error && <Text style={styles.error} accessibilityRole="alert">Не удалось загрузить шрифты. Используется системный шрифт.</Text>}
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="card" />
    </Stack>
    <StatusBar style="light" />
  </>;
}
const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  error: { color: colors.danger, backgroundColor: colors.background, padding: 16 },
});
