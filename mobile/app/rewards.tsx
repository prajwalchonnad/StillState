import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { theme } from '../src/theme';
import { GlassCard, BadgeIcon, AnimatedProgressBar } from '../src/components/ui';
import { useRewardStore } from '../src/stores/useRewardStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RewardsScreen() {
  const { points, badges, streak, fetchRewards, isLoading } = useRewardStore();

  useEffect(() => {
    fetchRewards();
  }, []);

  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  const renderBadgeCard = (badge: any, isEarned: boolean) => (
    <GlassCard 
      key={badge.id} 
      style={[styles.badgeCard, !isEarned && styles.lockedBadgeCard]}
    >
      <View style={styles.badgeIconContainer}>
        {isEarned ? (
          <BadgeIcon name={badge.iconName || 'star'} size={24} colors={theme.colors.gradient} />
        ) : (
          <View style={styles.lockedIcon}>
            <Feather name="lock" size={24} color={theme.colors.textMuted} />
          </View>
        )}
      </View>
      <Text style={[styles.badgeName, !isEarned && styles.lockedText]}>{badge.name}</Text>
      <Text style={styles.badgeDesc} numberOfLines={2}>{badge.description}</Text>
      
      {!isEarned && badge.type === 'MILESTONE' && (
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>{points} / {badge.threshold}</Text>
          <AnimatedProgressBar progress={Math.min(points / badge.threshold, 1)} height={4} />
        </View>
      )}
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchRewards} tintColor={theme.colors.warning} />}
      >
        {/* Points Display */}
        <View style={styles.pointsHeader}>
          <View style={styles.pointsCircle}>
            <LinearGradient
              colors={[theme.colors.warning, '#FCD34D']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <Feather name="star" size={32} color={theme.colors.background} />
          </View>
          <Text style={styles.pointsValue}>{points}</Text>
          <Text style={styles.pointsLabel}>Total Points</Text>
        </View>

        {/* Streak Card */}
        <GlassCard style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Feather name="zap" size={24} color={theme.colors.danger} />
            <Text style={styles.streakTitle}>Current Streak</Text>
          </View>
          <Text style={styles.streakValue}>{streak} Days</Text>
          <Text style={styles.streakDesc}>Complete tasks daily to keep your flame alive!</Text>
        </GlassCard>

        {/* Badges Grid */}
        <Text style={styles.sectionTitle}>Earned Badges ({earnedBadges.length})</Text>
        <View style={styles.grid}>
          {earnedBadges.length > 0 ? (
            earnedBadges.map(b => renderBadgeCard(b, true))
          ) : (
            <Text style={styles.emptyText}>Complete tasks to earn your first badge!</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Locked Challenges</Text>
        <View style={styles.grid}>
          {lockedBadges.map(b => renderBadgeCard(b, false))}
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  pointsHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    marginTop: theme.spacing.xl,
  },
  pointsCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    shadowColor: theme.colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -1,
  },
  pointsLabel: {
    ...theme.typography.bodySemibold,
    color: theme.colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  streakTitle: {
    ...theme.typography.bodySemibold,
    color: theme.colors.danger,
    marginLeft: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakValue: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  streakDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  badgeCard: {
    width: '48%',
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  lockedBadgeCard: {
    opacity: 0.6,
  },
  badgeIconContainer: {
    marginBottom: theme.spacing.md,
    height: 60,
    justifyContent: 'center',
  },
  lockedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    ...theme.typography.captionSemibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDesc: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  lockedText: {
    color: theme.colors.textSecondary,
  },
  progressSection: {
    width: '100%',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  progressText: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
    textAlign: 'right',
    marginBottom: 4,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    width: '100%',
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
});
