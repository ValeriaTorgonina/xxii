import { type PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type SurfaceProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Surface({ children, style }: SurfaceProps) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },
});
