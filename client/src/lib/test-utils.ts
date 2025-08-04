import { TestSession, TestResult, PersonalBest, TestType } from '@/types/test';

export function calculateSessionStats(results: TestResult[]) {
  if (results.length === 0) {
    return {
      average: 0,
      best: 0,
      worst: 0,
      consistency: 0,
      validTrials: 0,
      excludedOutliers: 0
    };
  }

  const times = results.map(r => r.reactionTime);
  
  // Scientific protocol: Exclude fastest and slowest trials (outliers) before averaging
  // This follows sports science best practices from volleyball research
  let processedTimes = [...times];
  let excludedCount = 0;
  
  if (times.length >= 5) {
    // Sort to identify outliers
    const sorted = [...times].sort((a, b) => a - b);
    const fastest = sorted[0];
    const slowest = sorted[sorted.length - 1];
    
    // Remove one instance each of fastest and slowest
    processedTimes = times.filter((time, index) => {
      if (time === fastest && excludedCount === 0) {
        excludedCount++;
        return false;
      }
      if (time === slowest && excludedCount === 1) {
        excludedCount++;
        return false;
      }
      return true;
    });
  }
  
  const average = processedTimes.reduce((sum, time) => sum + time, 0) / processedTimes.length;
  const best = Math.min(...times); // Best from all trials
  const worst = Math.max(...times); // Worst from all trials
  
  // Calculate consistency as the inverse of coefficient of variation
  const standardDeviation = Math.sqrt(
    processedTimes.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / processedTimes.length
  );
  const coefficientOfVariation = standardDeviation / average;
  const consistency = Math.max(0, Math.min(100, (1 - coefficientOfVariation) * 100));

  return {
    average: Math.round(average),
    best: Math.round(best),
    worst: Math.round(worst),
    consistency: Math.round(consistency),
    validTrials: processedTimes.length,
    excludedOutliers: excludedCount
  };
}

export function getPerformanceRating(reactionTime: number, type: TestType): string {
  // Evidence-based thresholds from volleyball research
  // Visual: Female setters avg 236ms, spikers avg 222ms
  // Auditory: Female setters avg 200ms, spikers avg 199ms
  // Choice RT typically 50-100ms slower than simple RT
  const isChoice = type.includes('choice');
  const isAuditory = type.includes('auditory');
  
  let thresholds;
  if (isChoice) {
    // Choice reaction times are typically 50-100ms slower
    thresholds = isAuditory 
      ? { excellent: 250, good: 300, fair: 380 }  // Choice auditory
      : { excellent: 280, good: 330, fair: 400 }; // Choice visual
  } else {
    // Simple reaction times
    thresholds = isAuditory
      ? { excellent: 180, good: 220, fair: 280 }  // Simple auditory
      : { excellent: 220, good: 250, fair: 300 }; // Simple visual
  }

  if (reactionTime <= thresholds.excellent) return 'Elite Level';
  if (reactionTime <= thresholds.good) return 'Competitive';
  if (reactionTime <= thresholds.fair) return 'Recreational';
  return 'Needs Training';
}

export function getPerformanceColor(reactionTime: number, type: TestType): string {
  const isChoice = type.includes('choice');
  const isAuditory = type.includes('auditory');
  
  let thresholds;
  if (isChoice) {
    thresholds = isAuditory 
      ? { excellent: 250, good: 300, fair: 380 }
      : { excellent: 280, good: 330, fair: 400 };
  } else {
    thresholds = isAuditory
      ? { excellent: 180, good: 220, fair: 280 }
      : { excellent: 220, good: 250, fair: 300 };
  }

  if (reactionTime <= thresholds.excellent) return 'text-green-400';
  if (reactionTime <= thresholds.good) return 'text-yellow-400';
  if (reactionTime <= thresholds.fair) return 'text-orange-400';
  return 'text-red-400';
}

export function getPerformanceInsight(reactionTime: number, type: TestType): string {
  const rating = getPerformanceRating(reactionTime, type);
  const isChoice = type.includes('choice');
  const isAuditory = type.includes('auditory');
  const testTypeText = `${isChoice ? 'choice ' : ''}${isAuditory ? 'auditory' : 'visual'}`;
  
  switch (rating) {
    case 'Elite Level':
      return `Outstanding ${testTypeText} reaction time! You're performing at elite athlete levels.`;
    case 'Competitive':
      return `Strong ${testTypeText} reaction time. You're in the competitive range.`;
    case 'Recreational':
      return `Good ${testTypeText} reaction time for recreational play. Room for improvement.`;
    default:
      return `Your ${testTypeText} reaction time has significant room for improvement with training.`;
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
