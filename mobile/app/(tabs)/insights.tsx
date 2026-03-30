import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { theme } from '../../src/theme';
import { GlassCard, CircularProgress, BadgeIcon } from '../../src/components/ui';
import { useInsightStore } from '../../src/stores/useInsightStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function InsightsScreen() {
  const { 
    riskScore, 
    dominantCategory, 
    behaviorPatterns, 
    recommendations, 
    fetchInsights, 
    isLoading 
  } = useInsightStore();

  useEffect(() => {
    fetchInsights();
  }, []);

  const getRiskColor = (score: number) => {
    if (score < 30) return theme.colors.success;
    if (score < 60) return theme.colors.warning;
    return theme.colors.danger;
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Healthy Balance';
    if (score < 60) return 'Moderate Risk';
    return 'High Risk';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchInsights} tintColor={theme.colors.primary} />}
      >
        <Text style={styles.headerTitle}>Behavior Analysis</Text>
        
        {/* Risk Gauge */}
        <GlassCard style={styles.gaugeCard}>
          <Text style={styles.cardTitle}>Current Risk Score</Text>
          <View style={styles.gaugeContainer}>
            <CircularProgress 
              size={180} 
              strokeWidth={18} 
              progress={riskScore} 
              color={getRiskColor(riskScore)} 
              backgroundColor={theme.colors.cardBorder}
            />
            <View style={styles.gaugeInner}>
              <Text style={[styles.gaugeValue, { color: getRiskColor(riskScore) }]}>{riskScore}</Text>
              <Text style={styles.gaugeLabel}>{getRiskLabel(riskScore)}</Text>
            </View>
          </View>
          <Text style={styles.dominantCategory}>
            Dominant Interest: <Text style={styles.highlight}>{dominantCategory}</Text>
          </Text>
        </GlassCard>

        {/* Patterns */}
        <Text style={styles.sectionTitle}>Detected Patterns</Text>
        {behaviorPatterns.map(pattern => (
          <GlassCard key={pattern.id} style={styles.patternCard}>
            <View style={styles.patternHeader}>
              <BadgeIcon name="activity" size={16} colors={[theme.colors.secondary, theme.colors.accent]} />
              <Text style={styles.patternName}>{pattern.name}</Text>
            </View>
            <Text style={styles.patternDescription}>{pattern.description}</Text>
          </GlassCard>
        ))}

        {/* Recommendations */}
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <GlassCard style={styles.recommendationsCard}>
          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recRow}>
              <View style={styles.recDot} />
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}
        </GlassCard>
        
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
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  gaugeCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  gaugeLabel: {
    ...theme.typography.captionSemibold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  dominantCategory: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
  highlight: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  patternCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  patternName: {
    ...theme.typography.bodySemibold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  patternDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    paddingLeft: 40,
  },
  recommendationsCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
    marginRight: theme.spacing.md,
  },
  recText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
});
