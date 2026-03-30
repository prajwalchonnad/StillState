import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../src/theme';

export default function TasksLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surfaceElevated,
        },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Tasks' }} />
      <Stack.Screen name="[id]" options={{ title: 'Task Details' }} />
    </Stack>
  );
}
