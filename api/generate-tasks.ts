import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { interestProfile, age, activeTaskCount } = req.body;

  if (!interestProfile) {
    return res.status(400).json({ error: 'interestProfile is required' });
  }

  // Prevent overwhelming the child
  if (activeTaskCount && activeTaskCount >= 5) {
    return res.status(200).json({ tasks: [] });
  }

  // Simulated AI Logic: Personalizing tasks based on dominant application usage
  const tasks = [];
  const difficultyMultiplier = age && age > 12 ? 2 : 1; // Basic difficulty scaling
  const timestamp = new Date().toISOString();

  // If heavy gamer -> active physical tasks
  if (interestProfile === 'GAMING') {
    tasks.push({
      id: Math.random().toString(36).substring(7),
      type: 'PHYSICAL',
      title: 'Real-Life Quest: Walk 20 minutes outside',
      description: 'Step away from the screen and earn XP in real life! Walk around your neighborhood or park.',
      difficulty: 1 * difficultyMultiplier,
      points: 150 * difficultyMultiplier,
      completed: false,
      createdAt: timestamp,
    });
  } 
  // If heavy social media -> creative expression offline
  else if (interestProfile === 'SOCIAL_MEDIA') {
    tasks.push({
      id: Math.random().toString(36).substring(7),
      type: 'CREATIVE',
      title: 'Draw your mood or favorite character',
      description: 'Spend 15 minutes away from the phone sketching or drawing anything you want.',
      difficulty: 2 * difficultyMultiplier,
      points: 200 * difficultyMultiplier,
      completed: false,
      createdAt: timestamp,
    });
  }
  // Generic fallback if not heavy risk categories
  else {
    tasks.push({
      id: Math.random().toString(36).substring(7),
      type: 'MINDFULNESS',
      title: '5-Minute Box Breathing',
      description: 'Disconnect entirely. Inhale for 4s, hold 4s, exhale 4s, hold 4s. Repeat 5 times.',
      difficulty: 1,
      points: 100,
      completed: false,
      createdAt: timestamp,
    });
  }

  // Always suggest an educational component if they have balance
  tasks.push({
    id: Math.random().toString(36).substring(7),
    type: 'EDUCATIONAL',
    title: 'Offline Reading Time',
    description: 'Read one chapter of a physical book or magazine offline.',
    difficulty: 2 * difficultyMultiplier,
    points: 150,
    completed: false,
    createdAt: timestamp,
  });

  return res.status(200).json({
    tasks,
    message: 'Personalized tasks assigned based on digital footprint.',
  });
}
