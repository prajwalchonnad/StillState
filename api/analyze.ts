import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simulated AI Behavior Analysis
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { usageLogs } = req.body;

  if (!usageLogs || !Array.isArray(usageLogs)) {
    return res.status(400).json({ error: 'Valid usageLogs array required' });
  }

  // Simulated AI Logic: Pattern Detection
  const patterns = [];
  
  // Calculate total duration
  const totalDuration = usageLogs.reduce((sum, log) => sum + log.duration, 0);
  
  // Continuous usage check (simplified)
  const hasContinuousUsage = usageLogs.some(log => log.duration > 3600); // 1 hour contiguous
  if (hasContinuousUsage) {
    patterns.push({
      id: 'p1',
      name: 'Continuous Usage',
      description: 'Extended periods of screen time without breaks detected.',
      dateDetected: new Date().toISOString()
    });
  }

  if (usageLogs.length > 5) {
    patterns.push({
      id: 'p2',
      name: 'High Frequency',
      description: 'Device picked up frequently throughout the day.',
      dateDetected: new Date().toISOString()
    });
  }

  return res.status(200).json({
    patterns,
    analysisComplete: true,
    message: 'Behavior analysis successfully generated.'
  });
}
