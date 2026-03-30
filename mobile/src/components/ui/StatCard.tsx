import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { BadgeIcon } from './BadgeIcon';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  iconColors?: readonly [string, string, ...string[]];
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  iconName,
  iconColors,
  description,
  trend,
  trendValue,
}) => {
  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        {iconName && (
          <BadgeIcon name={iconName} size={20} colors={iconColors} />
        )}
      </View>
      
      {(description || trendValue) && (
        <View style={styles.footer}>
          {trend && trendValue && (
            <View style={styles.trendContainer}>
              <Feather 
                name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'minus'} 
                size={14} 
                color={trend === 'up' ? theme.colors.success : trend === 'down' ? theme.colors.danger : theme.colors.textMuted} 
              />
              <Text style={[
                styles.trendText, 
                { color: trend === 'up' ? theme.colors.success : trend === 'down' ? theme.colors.danger : theme.colors.textMuted }
              ]}>
                {trendValue}
              </Text>
            </View>
          )}
          {description && (
            <Text style={styles.descriptionText}>{description}</Text>
          )}
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  value: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  trendText: {
    ...theme.typography.label,
    marginLeft: 4,
  },
  descriptionText: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
