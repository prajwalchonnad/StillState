import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps, 
  ActivityIndicator,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  colors?: readonly [string, string, ...string[]];
  onPress: () => void;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  loading = false,
  colors = theme.colors.gradient,
  style,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[styles.container, style, disabled && styles.disabled]}
      {...props}
    >
      {/* We need at least 2 colors for the gradient, we ensure this via typings or just duplicate if only 1 is given */}
      <LinearGradient
        colors={(colors.length < 2 ? [colors[0], colors[0]] : colors) as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.text} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.spacing.md,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...theme.typography.bodySemibold,
    color: theme.colors.text,
  },
  disabled: {
    opacity: 0.5,
  },
});
