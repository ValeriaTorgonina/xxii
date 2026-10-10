import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors } from '@/shared/constants/colors';
import { decoration } from '@/shared/constants/decoration';

export function Decoration({ name, size = 20 }: { name: keyof typeof decoration; size?: number }) {
  return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <SvgXml color={name === 'search' ? colors.text : colors.primary} xml={decoration[name]} width={size} height={size} />
  </View>;
}

// Nine slices preserve the supplied frame's corners on tall and narrow panels.
export function PanelFrame() {
  const slices = [
    { box: '0 0 24 24', style: { top: 0, left: 0, width: 14, height: 14 } },
    { box: '216 0 24 24', style: { top: 0, right: 0, width: 14, height: 14 } },
    { box: '0 136 24 24', style: { bottom: 0, left: 0, width: 14, height: 14 } },
    { box: '216 136 24 24', style: { bottom: 0, right: 0, width: 14, height: 14 } },
    { box: '24 0 192 24', style: { top: 0, left: 14, right: 14, height: 14 } },
    { box: '24 136 192 24', style: { bottom: 0, left: 14, right: 14, height: 14 } },
    { box: '0 24 24 112', style: { top: 14, bottom: 14, left: 0, width: 14 } },
    { box: '216 24 24 112', style: { top: 14, bottom: 14, right: 0, width: 14 } },
  ];
  return <View pointerEvents="none" style={StyleSheet.absoluteFill} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {slices.map(slice => <View key={slice.box} style={[{ position: 'absolute', overflow: 'hidden' }, slice.style]}>
      <SvgXml xml={decoration['panel-frame']} viewBox={slice.box} width="100%" height="100%" preserveAspectRatio="none" />
    </View>)}
  </View>;
}
