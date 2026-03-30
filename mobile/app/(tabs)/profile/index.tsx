import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../src/theme';
import { GlassCard, StatCard } from '../../../src/components/ui';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { useRewardStore } from '../../../src/stores/useRewardStore';
import { useTaskStore } from '../../../src/stores/useTaskStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, role, signOut } = useAuthStore();
  const { points, streak, badges } = useRewardStore();
  const { completedTasks } = useTaskStore();

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Avatar Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={theme.colors.gradient}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.avatarText}>
              {user?.user_metadata?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.user_metadata?.name || 'Explorer'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{role}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Points"
            value={points}
            iconName="star"
            iconColors={[theme.colors.warning, '#FCD34D']}
          />
          <View style={styles.spacer} />
          <StatCard
            title="Current Streak"
            value={streak}
            iconName="flame"
            iconColors={['#EF4444', '#F97316']}
            description="Days in a row"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Tasks Done"
            value={completedTasks.length}
            iconName="check-circle"
            iconColors={[theme.colors.success, '#34D399']}
          />
          <View style={styles.spacer} />
          <StatCard
            title="Badges Earned"
            value={badges.filter(b => b.earned).length}
            iconName="award"
            iconColors={[theme.colors.primary, theme.colors.accent]}
          />
        </View>

        {/* Quick Links */}
        <Text style={styles.sectionTitle}>Account</Text>
        
        <GlassCard style={styles.linksCard}>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/(tabs)/profile/settings')}>
            <View style={styles.linkLeft}>
              <Feather name="settings" size={20} color={theme.colors.text} />
              <Text style={styles.linkText}>Settings</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/analytics')}>
            <View style={styles.linkLeft}>
              <Feather name="pie-chart" size={20} color={theme.colors.text} />
              <Text style={styles.linkText}>Analytics</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/rewards')}>
            <View style={styles.linkLeft}>
              <Feather name="award" size={20} color={theme.colors.text} />
              <Text style={styles.linkText}>Achievements</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </GlassCard>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    marginTop: theme.spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    ...theme.typography.h1,
    color: theme.colors.text,
    zIndex: 1,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  roleBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleText: {
    ...theme.typography.captionSemibold,
    color: theme.colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  spacer: {
    width: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  linksCard: {
    padding: 0,
    marginBottom: theme.spacing.xl,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    ...theme.typography.bodySemibold,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: theme.spacing.xxxl,
  },
  logoutText: {
    ...theme.typography.bodySemibold,
    color: theme.colors.danger,
    marginLeft: theme.spacing.sm,
  },
});
