import { useUsageStore } from '../stores/useUsageStore';
import { useAlertStore } from '../stores/useAlertStore';

let enforcementTimer: NodeJS.Timeout | null = null;
const SECONDS_MULTIPLIER = 10; // Speed up time 10x for MVP demo

export const startHealthEnforcement = () => {
  if (enforcementTimer) clearInterval(enforcementTimer);

  enforcementTimer = setInterval(() => {
    // 1. Tick the session duration in the usage store
    const { sessionDuration, updateSessionDuration } = useUsageStore.getState();
    const newSessionDuration = sessionDuration + (1 * SECONDS_MULTIPLIER);
    updateSessionDuration(newSessionDuration);

    // 2. Evaluate Health Rules
    const { triggerAlert, activeAlerts, alertHistory } = useAlertStore.getState();
    const allAlerts = [...activeAlerts, ...alertHistory];

    // Rule A: 20-20-20 Rule (Triggered roughly every 20 mins)
    // 20 mins = 1200 seconds
    if (newSessionDuration >= 1200 && newSessionDuration < 1200 + SECONDS_MULTIPLIER) {
      triggerAlert({
        userId: 'system',
        type: 'EYE_BREAK',
        severity: 'LOW',
        message: '20-20-20 Rule: Look at something 20 feet away for 20 seconds.'
      });
    }

    // Rule B: 60-minute Warning
    // 60 mins = 3600 seconds
    if (newSessionDuration >= 3600 && newSessionDuration < 3600 + SECONDS_MULTIPLIER) {
      triggerAlert({
        userId: 'system',
        type: 'USAGE_WARNING',
        severity: 'MEDIUM',
        message: "You've been on the screen for 60 minutes. It's time to stretch!"
      });
    }

    // Rule C: 90-minute Critical Restriction
    // 90 mins = 5400 seconds
    if (newSessionDuration >= 5400 && newSessionDuration < 5400 + SECONDS_MULTIPLIER) {
      triggerAlert({
        userId: 'system',
        type: 'RESTRICTED_MODE',
        severity: 'CRITICAL',
        message: "WARNING: You've reached 90 minutes. Restricted mode is about to engage."
      });
    }

  }, 1000); // Ticks every 1 IRL second
};

export const stopHealthEnforcement = () => {
  if (enforcementTimer) {
    clearInterval(enforcementTimer);
    enforcementTimer = null;
  }
};
