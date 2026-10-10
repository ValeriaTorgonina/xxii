import { useRef, useState, type ReactNode } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/shared/constants/colors';
import { theme } from '@/shared/constants/theme';

type KitButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  tabKeys?: { index: number; count: number; select: (index: number) => void };
};

export function KitButton({ children, selected, style, tabKeys, disabled, ...props }: KitButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<React.ComponentRef<typeof Pressable>>(null);
  const keyboardProps = Platform.OS === 'web' && tabKeys ? {
    tabIndex: selected ? 0 as const : -1 as const,
    onKeyDown: (event: { key: string; preventDefault: () => void; currentTarget: HTMLElement }) => {
      const { index, count, select } = tabKeys;
      const target = event.key === 'ArrowRight' ? (index + 1) % count
        : event.key === 'ArrowLeft' ? (index + count - 1) % count
          : event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : undefined;
      if (target === undefined) return;
      event.preventDefault();
      select(target);
      const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs?.[target]?.focus();
    },
  } : {};
  return (
    <Pressable {...props} {...keyboardProps} ref={ref} disabled={disabled}
      accessibilityRole={props.accessibilityRole ?? 'button'}
      accessibilityState={{ ...props.accessibilityState, disabled: !!disabled }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [styles.button, style, selected && styles.selected,
        (pressed || hovered) && !selected && styles.hover,
        focused && styles.focus, disabled && styles.disabled]}>
      {selected && <View pointerEvents="none" style={StyleSheet.absoluteFill}><Image accessible={false} source={require('../../../assets/design-kit/paper-noise.png')}
        resizeMode="repeat" style={styles.paperTexture} /></View>}
      {typeof children === 'string'
        ? <Text style={[styles.label, selected && styles.selectedLabel]}>{children}</Text>
        : children}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { minHeight: 44, borderRadius: theme.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  selected: { borderColor: colors.paper, backgroundColor: colors.paper },
  paperTexture: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.35 },
  label: { color: colors.text, fontFamily: theme.fonts.body, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  selectedLabel: { color: colors.onAction, fontFamily: theme.fonts.strong },
  hover: { backgroundColor: colors.hover },
  focus: { outlineWidth: 2, outlineColor: colors.paper, outlineOffset: 2, borderColor: colors.paper },
  disabled: { opacity: 0.45 },
});
