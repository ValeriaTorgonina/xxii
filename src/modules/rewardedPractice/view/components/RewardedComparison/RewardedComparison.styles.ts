import { StyleSheet } from 'react-native';
import { colors } from '@/shared/constants/colors';
import { theme } from '@/shared/constants/theme';

export const styles = StyleSheet.create({
  panel: { padding: 16, gap: 12, borderRadius: theme.radius, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  heading: { color: colors.text, fontFamily: theme.fonts.titleStrong, fontSize: 24 },
  text: { color: colors.muted, fontFamily: theme.fonts.body, fontSize: 13, lineHeight: 20 },
  label: { color: colors.primary, fontFamily: theme.fonts.medium, fontSize: 11 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: { flex: 1, minWidth: 110, alignItems: 'center', gap: 8 },
  art: { width: 110, height: 138 },
  name: { color: colors.text, fontFamily: theme.fonts.titleStrong, fontSize: 22, textAlign: 'center' },
  answer: { gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
});
