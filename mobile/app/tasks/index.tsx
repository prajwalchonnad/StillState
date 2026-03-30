import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme';
import { GlassCard, BadgeIcon } from '../../src/components/ui';
import { useTaskStore } from '../../src/stores/useTaskStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TasksScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const { activeTasks, completedTasks, fetchTasks, isLoading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const tasksToDisplay = activeTab === 'ACTIVE' ? activeTasks : completedTasks;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Segmented Control */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ACTIVE' && styles.activeTab]}
          onPress={() => setActiveTab('ACTIVE')}
        >
          <Text style={[styles.tabText, activeTab === 'ACTIVE' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'COMPLETED' && styles.activeTab]}
          onPress={() => setActiveTab('COMPLETED')}
        >
          <Text style={[styles.tabText, activeTab === 'COMPLETED' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTasks} tintColor={theme.colors.primary} />}
      >
        {tasksToDisplay.length > 0 ? (
          tasksToDisplay.map(task => (
            <TouchableOpacity 
              key={task.id} 
              onPress={() => router.push(`/tasks/${task.id}`)}
              style={styles.taskItem}
            >
              <GlassCard>
                <View style={styles.taskHeader}>
                  <View style={styles.appTypeContainer}>
                    <BadgeIcon 
                      name={
                        task.type === 'PHYSICAL' ? 'activity' : 
                        task.type === 'CREATIVE' ? 'pen-tool' : 
                        task.type === 'EDUCATIONAL' ? 'book-open' : 'star'
                      } 
                      size={20} 
                    />
                    <Text style={styles.taskType}>{task.type}</Text>
                  </View>
                  <Text style={[styles.taskPoints, activeTab === 'COMPLETED' && { color: theme.colors.success }]}>
                    {activeTab === 'ACTIVE' ? `+${task.points} pts` : `${task.points} pts x`}
                  </Text>
                </View>
                
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription} numberOfLines={2}>{task.description}</Text>
                
                <View style={styles.taskFooter}>
                  <View style={styles.difficultyContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Feather 
                        key={i} 
                        name="star" 
                        size={12} 
                        color={i < task.difficulty ? theme.colors.warning : theme.colors.textMuted} 
                        style={styles.starIcon}
                      />
                    ))}
                  </View>
                  
                  {activeTab === 'COMPLETED' && (
                    <View style={styles.completedBadge}>
                      <Feather name="check" size={14} color={theme.colors.success} />
                      <Text style={styles.completedText}>Done</Text>
                    </View>
                  )}
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Feather name={activeTab === 'ACTIVE' ? 'check-circle' : 'inbox'} size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'ACTIVE' ? "You're all caught up!" : "No completed tasks yet."}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'ACTIVE' ? "Take a break or check back later for new challenges." : "Complete active tasks to see them here."}
            </Text>
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.spacing.md,
  },
  activeTab: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)', // primary alpha
  },
  tabText: {
    ...theme.typography.bodySemibold,
    color: theme.colors.textMuted,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  taskItem: {
    marginBottom: theme.spacing.md,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  appTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskType: {
    ...theme.typography.captionSemibold,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  taskPoints: {
    ...theme.typography.bodySemibold,
    color: theme.colors.warning,
  },
  taskTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  taskDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingTop: theme.spacing.sm,
  },
  difficultyContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 2,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedText: {
    ...theme.typography.captionSemibold,
    color: theme.colors.success,
    marginLeft: 4,
  },
  emptyCard: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
