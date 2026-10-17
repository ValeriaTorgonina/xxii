import { ActivityIndicator, Text, View } from 'react-native';
import { Artwork } from '@/features/Arcana';
import { KitButton } from '@/shared/components/KitButton';
import { colors } from '@/shared/constants/colors';
import { COMPARISON_ANSWER, COMPARISON_CARDS, COMPARISON_PROMPT } from '../../../model/constants';
import type { useRewardedComparison } from '../../../viewModel';
import { styles } from './RewardedComparison.styles';

export function RewardedComparison({ state }: { state: ReturnType<typeof useRewardedComparison> }) {
  if (!__DEV__) return null;
  return <View style={styles.panel}>
    <Text style={styles.label}>БОНУС · ТЕСТОВАЯ РЕКЛАМА</Text>
    <Text accessibilityRole="header" style={styles.heading}>Сравни две карты</Text>
    {state.unlocked ? <>
      <Text style={styles.text}>Упражнение открыто до закрытия приложения. Обе карты — в прямом положении.</Text>
      <View style={styles.cards}>
        {COMPARISON_CARDS.map(card => <View key={card.id} style={styles.card}>
          <Artwork number={card.number} name={card.name} role="day" style={styles.art} />
          <Text style={styles.name}>{card.number} · {card.name}</Text>
        </View>)}
      </View>
      <Text style={styles.text}>{COMPARISON_PROMPT}</Text>
      <KitButton accessibilityState={{ expanded: state.answerVisible }} onPress={() => state.setAnswerVisible(!state.answerVisible)}>
        {state.answerVisible ? 'Скрыть сравнение' : 'Проверить себя'}
      </KitButton>
      {state.answerVisible && <View style={styles.answer} accessibilityLiveRegion="polite">
        <Text style={styles.text}>{COMPARISON_ANSWER}</Text>
        {COMPARISON_CARDS.map(card => <Text key={card.id} style={styles.text}>{card.name}: {card.upright}</Text>)}
      </View>}
    </> : <>
      <Text style={styles.text}>Посмотри одно объявление целиком, чтобы открыть сравнение Шута и Мага до закрытия приложения. Это необязательно: обычная практика остаётся доступной.</Text>
      {state.available ? <KitButton selected disabled={state.status !== 'idle'} onPress={state.unlock}>
        {state.status === 'loading' ? 'Загружаем рекламу…' : state.status === 'showing' ? 'Идёт показ…' : 'Смотреть рекламу и открыть'}
      </KitButton> : <Text style={styles.text}>Тестовый показ доступен в отдельной сборке для iOS или Android. В браузере и Expo Go реклама не показывается.</Text>}
      {state.status === 'loading' && <>
        <ActivityIndicator color={colors.primary} accessibilityLabel="Загрузка рекламы" />
        <KitButton onPress={state.cancel}>Отменить загрузку</KitButton>
      </>}
      {!!state.message && <Text style={styles.text} accessibilityLiveRegion="polite">{state.message}</Text>}
    </>}
  </View>;
}
