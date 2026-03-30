import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../src/theme';
import { GlassCard, GradientButton } from '../src/components/ui';
import { useAuthStore, UserRole } from '../src/stores/useAuthStore';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthScreen() {
  const router = useRouter();
  const { selectRole, signIn, role } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = (selectedRole: UserRole) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    selectRole(selectedRole);
  };

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    
    try {
      const { error } = await signIn(email);
      if (error) {
        throw error;
      }
      Alert.alert('Check your email', 'We sent you a magic link to sign in.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceElevated]}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to StillState</Text>
          <Text style={styles.subtitle}>Find your digital balance</Text>

          {!role ? (
            <GlassCard style={styles.card}>
              <Text style={styles.instruction}>Are you a Parent or a Child?</Text>
              
              <View style={styles.roleContainer}>
                <GradientButton
                  title="Parent"
                  onPress={() => handleRoleSelection('PARENT')}
                  style={styles.roleButton}
                  colors={[theme.colors.primary, theme.colors.secondary]}
                />
                <View style={styles.spacer} />
                <GradientButton
                  title="Child"
                  onPress={() => handleRoleSelection('CHILD')}
                  style={styles.roleButton}
                  colors={[theme.colors.secondary, theme.colors.accent]}
                />
              </View>
            </GlassCard>
          ) : (
            <GlassCard style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.instruction}>Sign in as {role}</Text>
                <Text 
                  style={styles.changeRole} 
                  onPress={() => selectRole(null as any)}
                >
                  Change
                </Text>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
              
              <GradientButton
                title="Send Magic Link"
                onPress={handleLogin}
                loading={loading}
              />
            </GlassCard>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  card: {
    padding: theme.spacing.xl,
  },
  instruction: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  changeRole: {
    ...theme.typography.captionSemibold,
    color: theme.colors.primary,
  },
  roleContainer: {
    flexDirection: 'column',
  },
  roleButton: {
    width: '100%',
  },
  spacer: {
    height: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    ...theme.typography.body,
  },
});
