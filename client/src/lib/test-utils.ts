import { TestSession, TestResult, PersonalBest } from '@/types/test';

export function calculateSessionStats(results: TestResult[]) {
  if (results.length === 0) {
    return {
      average: 0,
      best: 0,
      worst: 0,
      consistency: 0
    };
  }

  const times = results.map(r => r.reactionTime);
  const average = times.reduce((sum, time) => sum + time, 0) / times.length;
  const best = Math.min(...times);
  const worst = Math.max(...times);
  
  // Calculate consistency as the inverse of coefficient of variation
  const standardDeviation = Math.sqrt(
    times.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / times.length
  );
  const coefficientOfVariation = standardDeviation / average;
  const consistency = Math.max(0, Math.min(100, (1 - coefficientOfVariation) * 100));

  return {
    average: Math.round(average),
    best: Math.round(best),
    worst: Math.round(worst),
    consistency: Math.round(consistency)
  };
}

export function getPerformanceRating(reactionTime: number, type: 'visual' | 'auditory'): string {
  // Evidence-based thresholds from volleyball research
  // Visual: Female setters avg 236ms, spikers avg 222ms
  // Auditory: Female setters avg 200ms, spikers avg 199ms
  const thresholds = type === 'visual' 
    ? { excellent: 220, good: 250, fair: 300 }  // Based on elite volleyball data
    : { excellent: 180, good: 220, fair: 280 }; // Auditory advantage reflected

  if (reactionTime <= thresholds.excellent) return 'Elite Level';
  if (reactionTime <= thresholds.good) return 'Competitive';
  if (reactionTime <= thresholds.fair) return 'Recreational';
  return 'Needs Training';
}

export function getPerformanceColor(reactionTime: number, type: 'visual' | 'auditory'): string {
  const thresholds = type === 'visual' 
    ? { excellent: 220, good: 250, fair: 300 }
    : { excellent: 180, good: 220, fair: 280 };

  if (reactionTime <= thresholds.excellent) return 'text-green-400';
  if (reactionTime <= thresholds.good) return 'text-yellow-400';
  if (reactionTime <= thresholds.fair) return 'text-orange-400';
  return 'text-red-400';
}

export function getPerformanceInsight(reactionTime: number, type: 'visual' | 'auditory'): string {
  const rating = getPerformanceRating(reactionTime, type);
  const typeText = type === 'visual' ? 'visual' : 'auditory';
  
  switch (rating) {
    case 'Elite Level':
      return `Outstanding ${typeText} reaction time! You're performing at elite athlete levels.`;
    case 'Competitive':
      return `Strong ${typeText} reaction time. You're in the competitive range.`;
    case 'Recreational':
      return `Good ${typeText} reaction time for recreational play. Room for improvement.`;
    default:
      return `Your ${typeText} reaction time has significant room for improvement with training.`;
  }
}

export function updatePersonalBest(
  currentBest: PersonalBest,
  newSession: TestSession
): PersonalBest {
  const newBest = { ...currentBest };
  
  if (newSession.type === 'visual') {
    if (!newBest.visual || newSession.best < newBest.visual) {
      newBest.visual = newSession.best;
    }
  } else {
    if (!newBest.auditory || newSession.best < newBest.auditory) {
      newBest.auditory = newSession.best;
    }
  }
  
  return newBest;
}

export function exportToCSV(session: TestSession): void {
  const csvContent = [
    'trial_number,reaction_time_ms',
    ...session.results.map((result, index) => `${index + 1},${Math.round(result.reactionTime)}`)
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `reaction_test_${session.type}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function shareResults(session: TestSession): Promise<void> {
  const shareText = `I got an average reaction time of ${session.average}ms on the ${session.type} reaction test!`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Reaction Time Test Results',
        text: shareText,
        url: window.location.href
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        fallbackShare(shareText);
      }
    }
  } else {
    fallbackShare(shareText);
  }
}

function fallbackShare(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!');
    });
  } else {
    alert(`Results: ${text}`);
  }
}

export function generateRandomDelay(): number {
  return Math.random() * 2000 + 1000; // 1-3 seconds in milliseconds
}
