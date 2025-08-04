export type TestType = 'visual' | 'auditory' | 'choice-visual' | 'choice-auditory';

export interface TestResult {
  id: string;
  type: TestType;
  reactionTime: number;
  timestamp: number;
}

export interface TestSession {
  id: string;
  type: TestType;
  results: TestResult[];
  average: number;
  best: number;
  worst: number;
  consistency: number;
  timestamp: number;
  trialCount: number;
  validTrials: number;
  excludedOutliers: number;
  warmupCompleted?: boolean;
}

export interface TestSettings {
  trialCount: number;
  volume: number;
  haptics: boolean;
}

export interface PersonalBest {
  visual: number | null;
  auditory: number | null;
}

export type TestState = 'waiting' | 'ready' | 'stimulus' | 'react' | 'result' | 'complete';

export interface TrialData {
  trialNumber: number;
  reactionTime: number | null;
  startTime: number;
  stimulusTime: number;
}
