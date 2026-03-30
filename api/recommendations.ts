import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { riskScore, insights } = req.body;

  if (typeof riskScore !== 'number') {
    return res.status(400).json({ error: 'riskScore number required' });
  }

  const recommendations = [];

  // Simulated AI Logic: Generating contextual advice
  if (riskScore >= 70) {
    recommendations.push("Your screen time is at a critical level today. We strongly advise pausing all non-essential usage.");
    recommendations.push("Parents: Consider enforcing a soft device cutoff in the next hour.");
  } else if (riskScore >= 40) {
    recommendations.push("Usage is getting high. Try a 15-minute complete digital break.");
    recommendations.push("Engage in a physical task from the challenge list to lower risk.");
  } else {
    recommendations.push("Great job managing digital balance today!");
    recommendations.push("Reward yourself with tech-free hobbies or reading.");
  }

  // Adding context based on dominant interest
  if (insights?.dominantCategory === 'SOCIAL_MEDIA') {
    recommendations.push("Switching from scrolling to creating can reduce cognitive load.");
  }

  return res.status(200).json({ recommendations });
}
