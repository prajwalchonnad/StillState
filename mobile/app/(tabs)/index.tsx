import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme';
import { GlassCard, StatCard, CircularProgress, BadgeIcon } from '../../src/components/ui';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useRewardStore } from '../../src/stores/useRewardStore';
import { useInsightStore } from '../../src/stores/useInsightStore';
import { useTaskStore } from '../../src/stores/useTaskStore';
import { useUsageStore } from '../../src/stores/useUsageStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { points, streak, fetchRewards, isLoading: rewardsLoading } = useRewardStore();
  const { riskScore, fetchInsights, isLoading: insightsLoading } = useInsightStore();
  const { activeTasks, fetchTasks, isLoading: tasksLoading } = useTaskStore();
  const { dailyTotal, categoryBreakdown, fetchUsage, isLoading: usageLoading } = useUsageStore();

  const loadData = async () => {
    await Promise.all([
      fetchRewards(),
      fetchInsights(),
      fetchTasks(),
      fetchUsage()
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshing = rewardsLoading || insightsLoading || tasksLoading || usageLoading;

  const formatHours = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return theme.colors.success;
    if (score < 60) return theme.colors.warning;
    return theme.colors.danger;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor={theme.colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.user_metadata?.name || 'Explorer'}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Feather name="star" size={16} color={theme.colors.warning} />
            <Text style={styles.pointsText}>{points}</Text>
          </View>
        </View>

        {/* Risk Score & Screen Time */}
        <View style={styles.row}>
          <GlassCard style={styles.riskCard}>
            <Text style={styles.cardTitle}>Balance Score</Text>
            <View style={styles.circularContainer}>
              <View style={styles.circularWrapper}>
                <CircularProgress 
                  size={100} 
                  strokeWidth={10} 
                  progress={100 - riskScore} // 100 means good balance
                  color={getRiskColor(riskScore)} 
                />
              </View>
              <View style={styles.riskScoreInner}>
                <Text style={styles.riskScoreValue}>{100 - riskScore}</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              {riskScore < 30 ? 'Great balance today!' : riskScore < 60 ? 'Watch your screen time' : 'Time for a break'}
            </Text>
          </GlassCard>

          <View style={styles.statsCol}>
            <StatCard
              title="Screen Time"
              value={formatHours(dailyTotal)}
              iconName="clock"
              iconColors={[theme.colors.secondary, theme.colors.accent]}
            />
            <View style={styles.spacer} />
            <StatCard
              title="Streak"
              value={`${streak} Days`}
              iconName="flame"
              iconColors={[theme.colors.warning, theme.colors.danger]}
            />
          </View>
        </View>

        {/* Active Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Challenges</Text>
            <TouchableOpacity onPress={() => router.push('/tasks')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {activeTasks.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalContent}>
              {activeTasks.map(task => (
                <TouchableOpacity key={task.id} onPress={() => router.push(`/tasks/${task.id}`)}>
                  <GlassCard style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                      <BadgeIcon 
                        name={
                          task.type === 'PHYSICAL' ? 'activity' : 
                          task.type === 'CREATIVE' ? 'pen-tool' : 
                          task.type === 'EDUCATIONAL' ? 'book-open' : 'star'
                        } 
                        size={16} 
                      />
                      <Text style={styles.taskPoints}>+{task.points} pts</Text>
                    </View>
                    <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                    <Text style={styles.taskSubtitle}>{task.type}</Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>All done for today! 🎉</Text>
            </GlassCard>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/analytics')}>
              <GlassCard style={styles.actionCard}>
                <Feather name="pie-chart" size={24} color={theme.colors.primary} />
                <Text style={styles.actionText}>Analytics</Text>
              </GlassCard>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/rewards')}>
              <GlassCard style={styles.actionCard}>
                <Feather name="award" size={24} color={theme.colors.warning} />
                <Text style={styles.actionText}>Rewards</Text>
              </GlassCard>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/alerts')}>
              <GlassCard style={styles.actionCard}>
                <Feather name="bell" size={24} color={theme.colors.danger} />
                <Text style={styles.actionText}>Alerts</Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
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
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  pointsText: {
    ...theme.typography.bodySemibold,
    color: theme.colors.warning,
    marginLeft: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  riskCard: {
    flex: 1.2,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  statsCol: {
    flex: 1,
  },
  spacer: {
    height: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.bodySemibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  cardSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  circularContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  circularWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  riskScoreInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskScoreValue: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  seeAll: {
    ...theme.typography.bodySemibold,
    color: theme.colors.primary,
  },
  horizontalScroll: {
    marginHorizontal: -theme.spacing.md,
  },
  horizontalContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  taskCard: {
    width: 160,
    padding: theme.spacing.md,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  taskPoints: {
    ...theme.typography.captionSemibold,
    color: theme.colors.warning,
  },
  taskTitle: {
    ...theme.typography.bodySemibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  taskSubtitle: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
  },
  emptyCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  actionItem: {
    flex: 1,
  },
  actionCard: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    ...theme.typography.captionSemibold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
});
