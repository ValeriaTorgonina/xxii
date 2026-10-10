import { useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { artwork } from '../../constants/artwork';
import { colors } from '@/shared/constants/colors';
import { theme } from '@/shared/constants/theme';
import { KitButton } from '@/shared/components/KitButton';

type ArtworkProps = { number: string; name: string; role: 'day' | 'list'; style?: StyleProp<ViewStyle>; decorative?: boolean; retry?: boolean; reversed?: boolean; eager?: boolean };
export function Artwork(props: ArtworkProps) {
  return <ArtworkImage key={`${props.number}-${props.role}`} {...props} />;
}
function ArtworkImage({ number, name, role, style, decorative, retry, reversed, eager = role === 'day' }: ArtworkProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const source = artwork[number]?.[role];
  const uri = typeof source === 'object' && !Array.isArray(source) ? source.uri : undefined;
  return <View style={[styles.frame, style]} accessibilityState={{ busy: status === 'loading' }}>
    {source && status !== 'error' && (Platform.OS === 'web'
      ? <img key={attempt} src={uri} alt={decorative ? '' : name} loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setStatus('ready')} onError={() => setStatus('error')}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transform: reversed ? 'rotate(180deg)' : undefined }} />
      : <Image key={attempt} source={source} resizeMode="contain"
          accessible={!decorative} accessibilityLabel={decorative ? undefined : name}
          onLoad={() => setStatus('ready')} onError={() => setStatus('error')}
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }, reversed && { transform: [{ rotate: '180deg' }] }]} />)}
    {source && status === 'loading' && <ActivityIndicator accessibilityLabel="Загрузка иллюстрации" color={colors.primary} size="small" />}
    {(status === 'error' || !source) && <>
      <Text style={styles.fallback}>{role === 'list' ? '◇' : 'Иллюстрация недоступна'}</Text>
      {retry && <KitButton onPress={() => { setAttempt(attempt + 1); setStatus('loading'); }}>Повторить</KitButton>}
    </>}
  </View>;
}
const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center' },
  fallback: { color: colors.muted, fontSize: 12, fontFamily: theme.fonts.body, textAlign: 'center' },
});
