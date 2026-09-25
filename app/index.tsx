import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Surface } from '@/components/surface';
import { MAJOR_ARCANA, type TarotCard } from '@/lib/tarot-data';

type Mode = 'learn' | 'practice';
type Orientation = 'upright' | 'reversed';

const GROUPS = [
  { key: 'all', label: 'Все' },
  { key: '0-7', label: '0-VII' },
  { key: '8-14', label: 'VIII-XIV' },
  { key: '15-21', label: 'XV-XXI' },
] as const;

export default function HomeScreen() {
  const [mode, setMode] = useState<Mode>('learn');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<(typeof GROUPS)[number]['key']>('all');
  const [selectedId, setSelectedId] = useState(MAJOR_ARCANA[0].id);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>('upright');
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  const selectedCard = MAJOR_ARCANA.find((card) => card.id === selectedId) ?? MAJOR_ARCANA[0];
  const practiceCard = MAJOR_ARCANA[practiceIndex % MAJOR_ARCANA.length];

  const filteredCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return MAJOR_ARCANA.filter((card, index) => {
      const matchesGroup =
        group === 'all' ||
        (group === '0-7' && index <= 7) ||
        (group === '8-14' && index >= 8 && index <= 14) ||
        (group === '15-21' && index >= 15);
      const matchesQuery =
        !normalizedQuery ||
        card.name.toLowerCase().includes(normalizedQuery) ||
        card.number.toLowerCase().includes(normalizedQuery) ||
        card.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery)) ||
        card.archetype.toLowerCase().includes(normalizedQuery);

      return matchesGroup && matchesQuery;
    });
  }, [group, query]);

  const dayCard = useMemo(() => {
    const daySeed = new Date().toISOString().slice(0, 10);
    const index = [...daySeed].reduce((total, char) => total + char.charCodeAt(0), 0);
    return MAJOR_ARCANA[index % MAJOR_ARCANA.length];
  }, []);

  const nextPracticeCard = () => {
    const nextIndex = (practiceIndex + 1) % MAJOR_ARCANA.length;
    setPracticeIndex(nextIndex);
    setOrientation(nextIndex % 3 === 0 ? 'reversed' : 'upright');
    setIsAnswerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>XXII</Text>
            <Text style={styles.subtitle}>Учебник старших арканов</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressValue}>{MAJOR_ARCANA.length}</Text>
            <Text style={styles.progressLabel}>карт</Text>
          </View>
        </View>

        <View style={styles.modeSwitch}>
          <ModeButton active={mode === 'learn'} label="Учить" onPress={() => setMode('learn')} />
          <ModeButton
            active={mode === 'practice'}
            label="Практика"
            onPress={() => setMode('practice')}
          />
        </View>

        {mode === 'learn' ? (
          <View style={styles.content}>
            <Surface style={styles.dayCard}>
              <Text style={styles.dayEyebrow}>Карта дня</Text>
              <Text style={styles.dayTitle}>
                {dayCard.number} · {dayCard.name}
              </Text>
              <Text style={styles.dayText}>{dayCard.practice}</Text>
            </Surface>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={setQuery}
              placeholder="Поиск по карте, архетипу или ключевому слову"
              placeholderTextColor="#8E8E93"
              style={styles.search}
              value={query}
            />

            <View style={styles.groups}>
              {GROUPS.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setGroup(item.key)}
                  style={[styles.groupButton, group === item.key && styles.groupButtonActive]}>
                  <Text style={[styles.groupText, group === item.key && styles.groupTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.learnBody}>
              <FlatList
                data={filteredCards}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cardList}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setSelectedId(item.id)}
                    style={[
                      styles.listCard,
                      selectedCard.id === item.id && styles.listCardActive,
                    ]}>
                    <Text style={styles.listNumber}>{item.number}</Text>
                    <View style={styles.listTextBlock}>
                      <Text style={styles.listName}>{item.name}</Text>
                      <Text numberOfLines={1} style={styles.listMeta}>
                        {item.archetype}
                      </Text>
                    </View>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>Ничего не найдено</Text>
                    <Text style={styles.emptyText}>Попробуй другой запрос или группу.</Text>
                  </View>
                }
                showsVerticalScrollIndicator={false}
                style={styles.list}
              />

              <CardDetails card={selectedCard} />
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.practiceContent} showsVerticalScrollIndicator={false}>
            <View style={styles.practiceCard}>
              <Text style={styles.practiceEyebrow}>
                {orientation === 'upright' ? 'Прямое положение' : 'Перевернутое положение'}
              </Text>
              <Text style={styles.practiceNumber}>{practiceCard.number}</Text>
              <Text style={styles.practiceName}>{practiceCard.name}</Text>
              <View style={styles.keywordRow}>
                {practiceCard.keywords.map((keyword) => (
                  <Text key={keyword} style={styles.keywordChip}>
                    {keyword}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.promptPanel}>
              <Text style={styles.panelTitle}>Вспомни значение</Text>
              <Text style={styles.promptText}>
                Сначала сформулируй смысл своими словами, затем открой ответ.
              </Text>
              {isAnswerVisible ? (
                <View style={styles.answerBox}>
                  <Text style={styles.answerTitle}>Ответ</Text>
                  <Text style={styles.answerText}>
                    {orientation === 'upright' ? practiceCard.upright : practiceCard.reversed}
                  </Text>
                  <Text style={styles.answerTitle}>Урок</Text>
                  <Text style={styles.answerText}>{practiceCard.lesson}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.practiceActions}>
              <Pressable
                onPress={() => setIsAnswerVisible((current) => !current)}
                style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  {isAnswerVisible ? 'Скрыть ответ' : 'Показать ответ'}
                </Text>
              </Pressable>
              <Pressable onPress={nextPracticeCard} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Следующая</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

function ModeButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeButton, active && styles.modeButtonActive]}>
      <Text style={[styles.modeText, active && styles.modeTextActive]}>{label}</Text>
    </Pressable>
  );
}

function CardDetails({ card }: { card: TarotCard }) {
  return (
    <ScrollView
      contentContainerStyle={styles.details}
      showsVerticalScrollIndicator={false}
      style={styles.detailsPanel}>
      <View style={styles.studyCard}>
        <Text style={styles.studyNumber}>{card.number}</Text>
        <Text style={styles.studyName}>{card.name}</Text>
        <Text style={styles.studyArchetype}>{card.archetype}</Text>
      </View>

      <Section title="Ключи" text={card.keywords.join(' · ')} />
      <Section title="Прямое положение" text={card.upright} />
      <Section title="Перевернутое положение" text={card.reversed} />
      <Section title="Урок карты" text={card.lesson} />
      <Section title="Вопрос для практики" text={card.practice} />
    </ScrollView>
  );
}

function Section({ text, title }: { text: string; title: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 2,
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    minWidth: 62,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  progressValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  progressLabel: {
    color: '#D1D5DB',
    fontSize: 11,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  modeSwitch: {
    backgroundColor: '#E5E7EB',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    padding: 5,
  },
  modeButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  modeText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '700',
  },
  modeTextActive: {
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  dayCard: {
    borderRadius: 18,
    marginBottom: 12,
    padding: 16,
  },
  dayEyebrow: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dayTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  dayText: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 21,
  },
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    color: '#111827',
    fontSize: 15,
    marginBottom: 10,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  groups: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  groupButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 12,
  },
  groupButtonActive: {
    backgroundColor: '#111827',
  },
  groupText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },
  groupTextActive: {
    color: '#FFFFFF',
  },
  learnBody: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  list: {
    flex: 0.44,
  },
  detailsPanel: {
    flex: 0.56,
  },
  cardList: {
    gap: 8,
    paddingBottom: 24,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 62,
    padding: 12,
  },
  listCardActive: {
    borderColor: '#7C3AED',
  },
  listNumber: {
    color: '#7C3AED',
    fontSize: 15,
    fontWeight: '800',
    width: 32,
  },
  listTextBlock: {
    flex: 1,
  },
  listName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  listMeta: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  details: {
    paddingBottom: 24,
  },
  studyCard: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 18,
    marginBottom: 12,
    minHeight: 158,
    padding: 18,
  },
  studyNumber: {
    color: '#C4B5FD',
    fontSize: 22,
    fontWeight: '800',
  },
  studyName: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    marginTop: 18,
    textAlign: 'center',
  },
  studyArchetype: {
    color: '#D1D5DB',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    padding: 14,
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionText: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 21,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  practiceContent: {
    paddingBottom: 24,
  },
  practiceCard: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 24,
    minHeight: 310,
    padding: 24,
  },
  practiceEyebrow: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  practiceNumber: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '900',
    marginTop: 40,
  },
  practiceName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  keywordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 22,
  },
  keywordChip: {
    backgroundColor: '#312E81',
    borderRadius: 999,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  promptPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 12,
    padding: 16,
  },
  panelTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  promptText: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 21,
  },
  answerBox: {
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
  },
  answerTitle: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  answerText: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 21,
  },
  practiceActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 54,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 54,
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
});
