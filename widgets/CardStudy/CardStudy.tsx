import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MAJOR_ARCANA } from '@/lib/tarot-data';
import { Artwork } from '@/features/Arcana';
import { KitButton } from '@/shared/components/KitButton';
import { PanelFrame } from '@/shared/components/Decoration';
import { colors } from '@/shared/constants/colors';
import { theme } from '@/shared/constants/theme';

export function CardStudy() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = MAJOR_ARCANA.findIndex(card => card.id === id);
  const card = MAJOR_ARCANA[index];
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/');
  const sections = card ? [
    { title: 'Ключи', text: card.keywords.join(' · ') },
    { title: 'Прямое положение', text: card.upright },
    { title: 'Перевернутое положение', text: card.reversed },
    { title: 'Урок карты', text: card.lesson },
    { title: 'Вопрос для практики', text: card.practice },
  ] : [];
  return <SafeAreaView style={styles.safe}>
    <View style={styles.toolbar}>
      <KitButton onPress={goBack}>‹ К списку карт</KitButton>
      {card && <Text style={styles.counter}>{index + 1} / {MAJOR_ARCANA.length}</Text>}
    </View>
    <ScrollView key={id} style={styles.scroll} contentContainerStyle={styles.content}>
      {card ? <>
        <View style={styles.card}>
          <Artwork number={card.number} name={card.name} role="day" retry style={styles.art} />
          <Text accessibilityRole="header" style={styles.title}>{card.number} · {card.name}</Text>
          <Text style={styles.text}>{card.archetype}</Text>
          <PanelFrame />
        </View>
        {sections.map(section => <View key={section.title} style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.text}>{section.text}</Text>
        </View>)}
      </> : <Text style={styles.text}>Карта не найдена. Вернитесь к списку и выберите карту.</Text>}
    </ScrollView>
    {card && <View style={styles.navigation}>
      <KitButton disabled={index === 0} onPress={() => router.setParams({ id: MAJOR_ARCANA[index - 1].id })} style={styles.action}>‹ Предыдущая</KitButton>
      <KitButton selected disabled={index === MAJOR_ARCANA.length - 1}
        onPress={() => router.setParams({ id: MAJOR_ARCANA[index + 1].id })} style={styles.action}>Следующая ›</KitButton>
    </View>}
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  toolbar: { width: '100%', maxWidth: theme.width, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, gap: 8 },
  counter: { color: colors.muted, fontSize: 12, fontFamily: theme.fonts.body },
  content: { width: '100%', maxWidth: theme.width, alignSelf: 'center', paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  card: { alignItems: 'center', padding: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: theme.radius, gap: 8 },
  art: { width: '100%', height: 300 },
  title: { color: colors.text, fontFamily: theme.fonts.titleStrong, fontSize: 30, lineHeight: 34, textAlign: 'center' },
  text: { color: colors.muted, fontFamily: theme.fonts.body, fontSize: 13, lineHeight: 19 },
  section: { borderWidth: 1, borderColor: colors.border, borderRadius: theme.radius, backgroundColor: colors.surface, padding: 16, gap: 8 },
  sectionTitle: { color: colors.primary, fontFamily: theme.fonts.strong, fontSize: 11, lineHeight: 16, letterSpacing: 0.99, textTransform: 'uppercase' },
  navigation: { width: '100%', maxWidth: theme.width, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  action: { flex: 1, minWidth: 125 },
});
