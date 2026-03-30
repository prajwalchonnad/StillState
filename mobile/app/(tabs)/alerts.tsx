import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { theme } from '../../src/theme';
import { GlassCard } from '../../src/components/ui';
import { useAlertStore } from '../../src/stores/useAlertStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AlertsScreen() {
  const { activeAlerts, alertHistory, fetchAlerts, dismissAlert, isLoading } = useAlertStore();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return theme.colors.danger;
      case 'HIGH': return theme.colors.danger;
      case 'MEDIUM': return theme.colors.warning;
      case 'LOW': return theme.colors.success;
      default: return theme.colors.textMuted;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diffMs = new Date().getTime() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchAlerts} tintColor={theme.colors.primary} />}
      >
        <Text style={styles.headerTitle}>System Alerts</Text>

        <Text style={styles.sectionTitle}>Active Alerts</Text>
        {activeAlerts.length > 0 ? (
          activeAlerts.map(alert => (
            <GlassCard key={alert.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View style={styles.alertTypeContainer}>
                  <Feather 
                    name={alert.type === 'EYE_BREAK' ? 'eye' : alert.type === 'USAGE_WARNING' ? 'clock' : 'alert-triangle'} 
                    size={20} 
                    color={getSeverityColor(alert.severity)} 
                  />
                  <Text style={[styles.alertType, { color: getSeverityColor(alert.severity) }]}>
                    {alert.type.replace('_', ' ')}
                  </Text>
                </View>
                <Text style={styles.timeText}>{getTimeAgo(alert.timestamp)}</Text>
              </View>
              
              <Text style={styles.alertMessage}>{alert.message}</Text>
              
              <TouchableOpacity style={styles.dismissButton} onPress={() => dismissAlert(alert.id)}>
                <Text style={styles.dismissText}>Dismiss</Text>
              </TouchableOpacity>
            </GlassCard>
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Feather name="check-circle" size={40} color={theme.colors.success} />
            <Text style={styles.emptyText}>No active alerts. Good job!</Text>
          </GlassCard>
        )}

        <Text style={[styles.sectionTitle, { marginTop: theme.spacing.xl }]}>History</Text>
        {alertHistory.length > 0 ? (
          alertHistory.map(alert => (
            <View key={alert.id} style={styles.historyRow}>
              <View style={styles.historyIconContainer}>
                <Feather 
                  name={alert.type === 'EYE_BREAK' ? 'eye' : alert.type === 'USAGE_WARNING' ? 'clock' : 'alert-triangle'} 
                  size={16} 
                  color={theme.colors.textMuted} 
                />
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyType}>{alert.type.replace('_', ' ')}</Text>
                <Text style={styles.historyTime}>{new Date(alert.timestamp).toLocaleString()}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyHistoryText}>No past alerts.</Text>
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
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  alertCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertType: {
    ...theme.typography.bodySemibold,
    marginLeft: theme.spacing.sm,
  },
  timeText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  alertMessage: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.spacing.sm,
  },
  dismissText: {
    ...theme.typography.captionSemibold,
    color: theme.colors.text,
  },
  emptyCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  historyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  historyContent: {
    flex: 1,
  },
  historyType: {
    ...theme.typography.bodySemibold,
    color: theme.colors.textSecondary,
  },
  historyTime: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  emptyHistoryText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});
