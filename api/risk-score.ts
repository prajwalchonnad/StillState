import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { usageLogs, patterns } = req.body;

  if (!usageLogs || !Array.isArray(usageLogs)) {
    return res.status(400).json({ error: 'usageLogs array required' });
  }

  // Simulated AI Risk Scoring Algorithm
  let baseScore = 20; // Default healthy baseline
  
  // Calculate total seconds
  const totalDuration = usageLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalHours = totalDuration / 3600;

  // Add penalties based on empirical limits (e.g., AAP guidelines)
  if (totalHours > 2) {
    baseScore += (totalHours - 2) * 15; // 15 points per hour over 2 hours
  }

  // Penalize for negative patterns identified by behavior-analyzer
  if (patterns && Array.isArray(patterns)) {
    baseScore += patterns.length * 10;
  }

  // Identify dominant category to add category-specific weights
  const categoryDurations = usageLogs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + log.duration;
    return acc;
  }, {} as Record<string, number>);

  let dominantCategory = 'OTHER';
  let maxDuration = 0;
  
  for (const [cat, dur] of Object.entries(categoryDurations) as [string, number][]) {
    if (dur > maxDuration) {
      maxDuration = dur;
      dominantCategory = cat;
    }
  }

  // Weight penalty based on app nature
  if (dominantCategory === 'GAMING' || dominantCategory === 'SOCIAL_MEDIA') {
    baseScore *= 1.1; // 10% penalty for passive consumption / addictive loops
  } else if (dominantCategory === 'EDUCATION') {
    baseScore *= 0.8; // 20% discount for productive usage
  }

  // Ensure bounded output 0-100
  const finalScore = Math.min(Math.max(Math.round(baseScore), 0), 100);

  return res.status(200).json({
    riskScore: finalScore,
    dominantCategory,
    details: {
      totalHours: totalHours.toFixed(1),
      patternsCount: patterns?.length || 0,
    }
  });
}
