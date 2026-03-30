import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface BadgeIconProps {
  name: React.ComponentProps<typeof Feather>['name'];
  size?: number;
  colors?: readonly [string, string, ...string[]];
  containerStyle?: ViewStyle;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  name,
  size = 24,
  colors = theme.colors.gradient,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, { width: size * 2, height: size * 2, borderRadius: size }, containerStyle]}>
      <LinearGradient
        colors={(colors.length < 2 ? [colors[0], colors[0]] : colors) as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.iconContainer}>
        <Feather name={name} size={size} color={theme.colors.text} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
