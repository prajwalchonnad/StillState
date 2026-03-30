import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { theme } from '../../../src/theme';
import { GlassCard } from '../../../src/components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true); // Always on for MVP
  const [contentFiltering, setContentFiltering] = useState(true);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <GlassCard style={styles.card}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive alerts and task updates</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.textMuted, true: theme.colors.primary }}
              thumbColor={theme.colors.text}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Use dark theme (Default)</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: theme.colors.textMuted, true: theme.colors.primary }}
              thumbColor={theme.colors.text}
              disabled={true} // Forced on for MVP
            />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Safety & Limitations</Text>
        
        <GlassCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
              <Text style={styles.settingTitle}>Content Filtering</Text>
              <Text style={styles.settingDescription}>Automatically restrict inappropriate apps during high-risk times</Text>
            </View>
            <Switch
              value={contentFiltering}
              onValueChange={setContentFiltering}
              trackColor={{ false: theme.colors.textMuted, true: theme.colors.warning }}
              thumbColor={theme.colors.text}
            />
          </View>
        </GlassCard>

        <Text style={styles.footerText}>Version 1.0.0 (MVP Build)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.captionSemibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    padding: 0,
    marginBottom: theme.spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  settingTitle: {
    ...theme.typography.bodySemibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
  },
  footerText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
