import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated as RNAnimated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../src/theme';
import { GlassCard, GradientButton, BadgeIcon } from '../../src/components/ui';
import { useTaskStore } from '../../src/stores/useTaskStore';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { tasks, completeTask } = useTaskStore();
  const task = tasks.find(t => t.id === id);
  
  const [isCompleting, setIsCompleting] = useState(false);
  const scaleAnim = new RNAnimated.Value(1);

  useEffect(() => {
    if (!task) {
      router.back();
    }
  }, [task]);

  if (!task) return null;

  const handleCompleteTask = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsCompleting(true);
    
    // Animate button
    RNAnimated.sequence([
      RNAnimated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      RNAnimated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start(async () => {
      await completeTask(task.id);
      setTimeout(() => {
        router.back();
      }, 500);
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassCard style={styles.card}>
          <View style={styles.header}>
            <BadgeIcon 
              name={
                task.type === 'PHYSICAL' ? 'activity' : 
                task.type === 'CREATIVE' ? 'pen-tool' : 
                task.type === 'EDUCATIONAL' ? 'book-open' : 'star'
              } 
              size={32} 
            />
            <View style={styles.pointsBadge}>
              <Feather name="plus" size={16} color={theme.colors.warning} />
              <Text style={styles.pointsText}>{task.points} pts</Text>
            </View>
          </View>

          <Text style={styles.title}>{task.title}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="tag" size={16} color={theme.colors.textMuted} />
              <Text style={styles.metaText}>{task.type}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>Difficulty:</Text>
              <View style={styles.difficultyContainer}>
                {[...Array(5)].map((_, i) => (
                  <Feather 
                    key={i} 
                    name="star" 
                    size={14} 
                    color={i < task.difficulty ? theme.colors.warning : theme.colors.textMuted} 
                    style={styles.starIcon}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.descriptionLabel}>What to do:</Text>
          <Text style={styles.description}>{task.description}</Text>

          {task.completed && (
            <View style={styles.completedContainer}>
              <Feather name="check-circle" size={24} color={theme.colors.success} />
              <Text style={styles.completedText}>
                Completed on {new Date(task.completedAt!).toLocaleDateString()}
              </Text>
            </View>
          )}

        </GlassCard>
      </ScrollView>

      {!task.completed && (
        <View style={styles.footer}>
          <RNAnimated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <GradientButton
              title={isCompleting ? "Awesome! 🎉" : "Mark as Complete"}
              onPress={handleCompleteTask}
              disabled={isCompleting}
              colors={
                isCompleting 
                ? [theme.colors.success, '#059669'] as any
                : [theme.colors.primary, theme.colors.secondary] as any
              }
            />
          </RNAnimated.View>
        </View>
      )}
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
  },
  card: {
    padding: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
  },
  pointsText: {
    ...theme.typography.h3,
    color: theme.colors.warning,
    marginLeft: 4,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textMuted,
    marginHorizontal: theme.spacing.md,
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginLeft: theme.spacing.xs,
  },
  starIcon: {
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginVertical: theme.spacing.lg,
  },
  descriptionLabel: {
    ...theme.typography.bodySemibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    backgroundColor: theme.colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  completedContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    ...theme.typography.bodySemibold,
    color: theme.colors.success,
    marginLeft: theme.spacing.sm,
  },
});
