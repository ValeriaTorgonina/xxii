import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Artwork } from '@/features/Arcana';
import { KitButton } from '@/shared/components/KitButton';
import { Decoration, PanelFrame } from '@/shared/components/Decoration';
import { Screen } from '@/shared/components/Screen';
import { colors } from '@/shared/constants/colors';
import { theme } from '@/shared/constants/theme';
import { GROUPS } from './constants/groups';
import { useCatalog } from './hooks/useCatalog';
import { Practice } from './components/Practice';

export function TarotCatalog() {
  const state = useCatalog();
  const { mode, setMode, query, setQuery, group, setGroup, filteredCards, dayCard } = state;
  const { width, fontScale } = useWindowDimensions();
  const largeText = fontScale > 1.5;
  const compact = width <= 360;
  const [searchFocused, setSearchFocused] = useState(false);
  const openCard = (id: string) => router.push({ pathname: '/card', params: { id } });
  return <Screen>
    <View style={styles.header}>
      <Image source={require('../../tarot-design-kit/assets/decor/header-ornament.png')}
        accessible={false} resizeMode="contain" style={styles.ornament} />
      <Text accessibilityRole="header" style={styles.title}>XXII</Text>
      <Text style={styles.subtitle}>Учебник старших арканов</Text>
    </View>
    <View style={[styles.tabs, largeText && { flexDirection: 'column' }]} accessibilityRole="tablist" accessibilityLabel="Режим обучения">
      {(['learn', 'practice'] as const).map((value, index) => <KitButton key={value}
        accessibilityRole="tab" aria-selected={mode === value} accessibilityState={{ selected: mode === value }} aria-controls={`${value}-panel`}
        tabKeys={{ index, count: 2, select: (next) => setMode(next === 0 ? 'learn' : 'practice') }}
        selected={mode === value} onPress={() => setMode(value)} style={[styles.tab, largeText && { flex: 0 }]}>
        <Text style={[styles.tabLabel, mode === value && styles.activeText]}>{index === 0 ? 'Учить' : 'Практика'}</Text>
      </KitButton>)}
    </View>
    {mode === 'learn' ? <View nativeID="learn-panel" role="tabpanel">
      <KitButton accessibilityLabel={`Карта дня: ${dayCard.name}`} onPress={() => openCard(dayCard.id)} style={styles.daily}>
        <View pointerEvents="none" style={[styles.dailyArt, largeText && { opacity: 0.2 }]}>
          <Artwork number={dayCard.number} name={dayCard.name} role="day" decorative style={styles.dailyImage} />
        </View>
        <LinearGradient pointerEvents="none" colors={[colors.surface, colors.surface, 'rgba(21,22,17,0.8)', 'rgba(21,22,17,0)']}
          locations={[0, 0.38, 0.59, 0.82]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        <View style={[styles.dailyCopy, compact && { maxWidth: '80%' }, largeText && { maxWidth: '100%' }]}>
          <Text style={styles.eyebrow}>Карта дня</Text>
          <Text style={[styles.dailyTitle, compact && { fontSize: 23 }]}>{dayCard.number} · {dayCard.name} →</Text>
          <Text style={styles.question}>{dayCard.practice}</Text>
        </View>
        <PanelFrame />
      </KitButton>
      <View style={[styles.search, searchFocused && styles.searchFocus]}>
        <Decoration name="search" />
        <TextInput accessibilityLabel="Поиск карт" autoCapitalize="none" autoCorrect={false}
          clearButtonMode="while-editing" keyboardAppearance="dark" selectionColor={colors.paper}
          placeholder="Поиск по карте, архетипу или ключевому слову" placeholderTextColor={colors.muted}
          value={query} onChangeText={setQuery} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} style={styles.input} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {GROUPS.map(item => <KitButton key={item.key} accessibilityLabel={item.label}
          aria-pressed={group === item.key} accessibilityState={{ selected: group === item.key }}
          selected={group === item.key} onPress={() => setGroup(item.key)}>{item.label}</KitButton>)}
      </ScrollView>
      <View style={styles.list}>
        {filteredCards.map((card, index) => <KitButton key={card.id} accessibilityLabel={`${card.number} · ${card.name}`}
          onPress={() => openCard(card.id)} style={[styles.row, compact && styles.compactRow, largeText && { flexDirection: 'column', alignItems: 'stretch', padding: 12 }]}>
          <Artwork number={card.number} name={card.name} role="list" decorative eager={index < 5} style={compact ? styles.compactThumb : styles.thumb} />
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.roman, compact && { width: 24 }, card.number.length > 2 && { fontSize: card.number.length > 3 ? 16 : 20 }]}>{card.number}</Text>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowTitle, compact && { fontSize: 20 }]}>{card.name}</Text>
            <Text style={styles.rowDescription}>{card.archetype}</Text>
          </View>
          <Decoration name="chevron-right" size={16} />
        </KitButton>)}
        {filteredCards.length === 0 && <View style={styles.empty} accessibilityLiveRegion="polite">
          <Text style={styles.question}>Ничего не найдено. Попробуй другой запрос или группу.</Text>
          <KitButton onPress={() => { setQuery(''); setGroup('all'); }}>Сбросить поиск</KitButton>
        </View>}
      </View>
    </View> : <Practice state={state} />}
  </Screen>;
}
const styles = StyleSheet.create({
  header: { minHeight: 110, paddingVertical: 23, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  ornament: { pointerEvents: 'none', position: 'absolute', top: 0, left: -12, width: '100%', height: 110, opacity: 0.72, transform: [{ scaleX: 1.07 }] },
  title: { color: colors.text, fontFamily: theme.fonts.titleMedium, fontSize: 34, lineHeight: 40, letterSpacing: 1.36, textShadowColor: colors.background, textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 } },
  subtitle: { color: colors.text, fontFamily: theme.fonts.title, fontSize: 17, lineHeight: 24, textAlign: 'center', textShadowColor: colors.background, textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 } },
  tabs: { flexDirection: 'row', gap: 4, padding: 3, borderRadius: theme.pill, backgroundColor: colors.surface, minHeight: 46 },
  tab: { flex: 1, borderWidth: 0 },
  tabLabel: { fontFamily: theme.fonts.strong, color: colors.text, fontSize: 14, lineHeight: 21 },
  activeText: { color: colors.onAction },
  daily: { marginTop: 16, minHeight: 142, paddingVertical: 16, paddingHorizontal: 18, borderRadius: theme.radius, backgroundColor: colors.surface, alignItems: 'stretch' },
  dailyArt: { position: 'absolute', right: -5, bottom: -5, opacity: 0.82 },
  dailyImage: { width: 142, height: 153 },
  dailyCopy: { maxWidth: '76%' },
  eyebrow: { color: colors.text, fontFamily: theme.fonts.body, fontSize: 11, lineHeight: 16, letterSpacing: 0.99, textTransform: 'uppercase' },
  dailyTitle: { color: colors.text, fontFamily: theme.fonts.titleStrong, fontSize: 24, lineHeight: 27, marginTop: 4, marginBottom: 8 },
  question: { color: colors.muted, fontFamily: theme.fonts.body, fontSize: 13, lineHeight: 19, maxWidth: 235 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 15, minHeight: 46, borderWidth: 1, borderColor: colors.border, borderRadius: theme.pill, backgroundColor: colors.surface, marginTop: 16 },
  searchFocus: { borderColor: colors.paper, outlineWidth: 2, outlineColor: colors.paper, outlineOffset: 2 },
  input: { flex: 1, minWidth: 0, minHeight: 44, paddingVertical: 10, color: colors.text, fontFamily: theme.fonts.body, fontSize: 12, outlineWidth: 0 },
  filters: { flexDirection: 'row', gap: 8, paddingVertical: 2, marginTop: 12, marginBottom: 14 },
  list: { gap: 7 },
  row: { minHeight: 76, borderRadius: 14, backgroundColor: colors.surface, flexDirection: 'row', gap: 12, paddingLeft: 2, paddingRight: 12, paddingVertical: 3 },
  compactRow: { gap: 8 },
  thumb: { width: 66, height: 68 },
  compactThumb: { width: 52, height: 64 },
  roman: { width: 28, color: colors.primary, fontFamily: theme.fonts.titleMedium, fontSize: 24, lineHeight: 26, textAlign: 'center' },
  rowCopy: { flex: 1, minWidth: 0 },
  rowTitle: { color: colors.text, fontFamily: theme.fonts.titleStrong, fontSize: 21, lineHeight: 24 },
  rowDescription: { color: colors.muted, fontFamily: theme.fonts.body, fontSize: 11, lineHeight: 16, marginTop: 2 },
  empty: { padding: 24, alignItems: 'center', gap: 12 },
});
