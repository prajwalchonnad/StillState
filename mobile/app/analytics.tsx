import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { theme } from '../src/theme';
import { GlassCard } from '../src/components/ui';
import { useUsageStore } from '../src/stores/useUsageStore';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { categoryBreakdown, fetchUsage } = useUsageStore();

  useEffect(() => {
    fetchUsage();
  }, []);

  // Mock past 7 days data for the BarChart
  const barData = [
    { value: 120 }, { value: 150 }, { value: 90 },
    { value: 180, frontColor: theme.colors.warning }, 
    { value: 130 }, { value: 110 }, { value: 140, frontColor: theme.colors.primary }
  ];

  // Map the category breakdown to the PieChart data format
  const getPieData = () => {
    const pieColors = [theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.warning, theme.colors.success];
    const keys = Object.keys(categoryBreakdown) as Array<keyof typeof categoryBreakdown>;
    return keys.map((key, index) => ({
      value: categoryBreakdown[key] || 1, // fallback to 1 so the chart has something if empty
      color: pieColors[index % pieColors.length],
      text: key.substring(0, 3)
    }));
  };

  const pieData = getPieData();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Daily Overview</Text>
        
        <GlassCard style={styles.chartCard}>
          <Text style={styles.chartTitle}>Past 7 Days (Minutes)</Text>
          <View style={styles.barChartContainer}>
            <BarChart
              data={barData}
              barWidth={22}
              spacing={20}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.colors.textMuted }}
              noOfSections={4}
              maxValue={200}
              frontColor={theme.colors.secondary}
              backgroundColor="transparent"
            />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Category Breakdown</Text>

        <GlassCard style={styles.chartCard}>
          <Text style={styles.chartTitle}>App Categories (Today)</Text>
          <View style={styles.pieContainer}>
            <PieChart
              data={pieData}
              donut
              showText
              textColor="black"
              radius={90}
              innerRadius={60}
              textSize={12}
              centerLabelComponent={() => {
                return (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, color: theme.colors.text, fontWeight: 'bold' }}>1h 50m</Text>
                    <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>Total</Text>
                  </View>
                );
              }}
            />
          </View>
          <View style={styles.legendContainer}>
            {Object.keys(categoryBreakdown).map((key, index) => {
              const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.warning, theme.colors.success];
              return (
                <View key={key} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors[index % colors.length] }]} />
                  <Text style={styles.legendText}>{key.replace('_', ' ')}</Text>
                </View>
              );
            })}
          </View>
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
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chartCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
  },
  chartTitle: {
    ...theme.typography.bodySemibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  barChartContainer: {
    alignItems: 'center',
    marginLeft: -10,
  },
  pieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
});
