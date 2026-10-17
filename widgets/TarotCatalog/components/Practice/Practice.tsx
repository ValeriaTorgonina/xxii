import { StyleSheet, Text, View } from 'react-native';
import { Artwork } from '@/features/Arcana';
import { KitButton } from '@/shared/components/KitButton';
import { PanelFrame } from '@/shared/components/Decoration';
import { colors } from '@/shared/constants/colors';
import { theme } from '@/shared/constants/theme';
import type { useCatalog } from '../../hooks/useCatalog';
import { RewardedComparison } from '@/src/modules/rewardedPractice/public';

export function Practice({ state }: { state: ReturnType<typeof useCatalog> }) {
  const { practiceCard: card, orientation, isAnswerVisible, setIsAnswerVisible, nextPracticeCard } = state;
  return <View style={styles.container} role="tabpanel" nativeID="practice-panel">
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{orientation === 'upright' ? 'Прямое положение' : 'Перевернутое положение'}</Text>
      <Artwork number={card.number} name={card.name} role="day" reversed={orientation === 'reversed'} retry style={styles.art} />
      <Text style={styles.title}>{card.number} · {card.name}</Text>
      <Text style={styles.text}>{card.keywords.join(' · ')}</Text>
      <PanelFrame />
    </View>
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.heading}>Вспомни значение</Text>
      <Text style={styles.text}>Сначала сформулируй смысл своими словами, затем открой ответ.</Text>
      {isAnswerVisible && <View style={styles.answer} accessibilityLiveRegion="polite">
        <Text style={styles.eyebrow}>Ответ</Text>
        <Text style={styles.text}>{orientation === 'upright' ? card.upright : card.reversed}</Text>
        <Text style={styles.eyebrow}>Урок</Text>
        <Text style={styles.text}>{card.lesson}</Text>
      </View>}
    </View>
    <KitButton selected accessibilityState={{ expanded: isAnswerVisible }} onPress={() => setIsAnswerVisible(!isAnswerVisible)}>
      {isAnswerVisible ? 'Скрыть ответ' : 'Показать ответ'}
    </KitButton>
    <KitButton onPress={nextPracticeCard}>Следующая</KitButton>
    <RewardedComparison state={state.comparison} />
  </View>;
}
const styles = StyleSheet.create({
  container: { gap: 12, marginTop: 16 },
  card: { backgroundColor: colors.surface, borderRadius: theme.radius, borderWidth: 1, borderColor: colors.border, padding: 20, alignItems: 'center', gap: 8 },
  art: { width: 220, height: 270, maxWidth: '100%' },
  title: { color: colors.text, fontFamily: theme.fonts.titleStrong, fontSize: 27, textAlign: 'center' },
  heading: { color: colors.text, fontFamily: theme.fonts.titleStrong, fontSize: 24 },
  eyebrow: { color: colors.primary, fontFamily: theme.fonts.body, fontSize: 11, lineHeight: 16, textTransform: 'uppercase', letterSpacing: 0.99 },
  text: { color: colors.muted, fontFamily: theme.fonts.body, fontSize: 13, lineHeight: 19 },
  panel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: theme.radius, gap: 8 },
  answer: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 8, gap: 8 },
});
