import type { PropsWithChildren } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { colors } from '@/shared/constants/colors';
import { decoration } from '@/shared/constants/decoration';
import { theme } from '@/shared/constants/theme';

export function Screen({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  return <SafeAreaView style={styles.safe}>
    <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
      contentContainerStyle={[styles.content, { paddingHorizontal: width <= 360 ? theme.compactEdge : theme.edge }]}>
      <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
        <Image source={require('../../../assets/design-kit/paper-noise.png')} resizeMode="repeat" style={[StyleSheet.absoluteFill, { opacity: 0.35, width: '100%', height: '100%' }]} />
        <SvgXml xml={decoration.stars} width="100%" height={844} />
      </View>
      {children}
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, width: '100%', maxWidth: theme.width, alignSelf: 'center', paddingTop: 16, paddingBottom: 24 },
});
