import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Eye, Volume2, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TestType, TestState, TrialData, TestSettings } from '@/types/test';
import { useAudio } from '@/hooks/use-audio';
import { generateRandomDelay, getPerformanceRating, getPerformanceColor, getPerformanceInsight } from '@/lib/test-utils';

interface TestPageProps {
  testType: TestType;
  settings: TestSettings;
  onComplete: (results: TrialData[]) => void;
  onExit: () => void;
}

export function TestPage({ testType, settings, onComplete, onExit }: TestPageProps) {
  const [testState, setTestState] = useState<TestState>('waiting');
  const [currentTrial, setCurrentTrial] = useState(1);
  const [trialData, setTrialData] = useState<TrialData>({
    trialNumber: 1,
    reactionTime: null,
    startTime: 0,
    stimulusTime: 0
  });
  const [allResults, setAllResults] = useState<TrialData[]>([]);
  const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { playBeep } = useAudio();

  const resetTrial = useCallback(() => {
    setTrialData({
      trialNumber: currentTrial,
      reactionTime: null,
      startTime: 0,
      stimulusTime: 0
    });
  }, [currentTrial]);

  const startTrial = useCallback(() => {
    setTestState('ready');
    resetTrial();
    
    const delay = generateRandomDelay();
    const timeout = setTimeout(() => {
      const stimulusTime = performance.now();
      setTrialData(prev => ({ ...prev, stimulusTime, startTime: stimulusTime }));
      setTestState('stimulus');
      
      if (testType === 'auditory') {
        playBeep(800, 200, settings.volume / 100);
      }
    }, delay);
    
    setDelayTimeout(timeout);
  }, [testType, playBeep, settings.volume, resetTrial]);

  const recordReaction = useCallback(() => {
    if (testState !== 'stimulus') return;
    
    const reactionTime = performance.now() - trialData.stimulusTime;
    const newTrialData = { ...trialData, reactionTime };
    
    setTrialData(newTrialData);
    setTestState('result');
    
    // Vibrate if haptics enabled
    if (settings.haptics && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [testState, trialData, settings.haptics]);

  const nextTrial = useCallback(() => {
    const newResults = [...allResults, trialData];
    setAllResults(newResults);
    
    if (currentTrial >= settings.trialCount) {
      onComplete(newResults);
    } else {
      setCurrentTrial(prev => prev + 1);
      setTestState('waiting');
    }
  }, [allResults, trialData, currentTrial, settings.trialCount, onComplete]);

  // Handle touch/click events for reaction
  useEffect(() => {
    const handleTouch = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      if (testState === 'stimulus') {
        recordReaction();
      }
    };

    if (testState === 'stimulus') {
      document.addEventListener('touchstart', handleTouch, { passive: false });
      document.addEventListener('mousedown', handleTouch);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('mousedown', handleTouch);
    };
  }, [testState, recordReaction]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (delayTimeout) {
        clearTimeout(delayTimeout);
      }
    };
  }, [delayTimeout]);

  const progress = (currentTrial / settings.trialCount) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Test Header */}
      <div className="bg-dark-surface p-4 border-b border-dark-elevated">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            data-testid="button-exit-test"
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="p-2 rounded-lg hover:bg-dark-elevated"
          >
            <ArrowLeft className="text-secondary" size={20} />
          </Button>
          <div className="text-center">
            <div className="text-sm text-secondary">
              {testType === 'visual' ? 'Visual Reaction Test' : 'Auditory Reaction Test'}
            </div>
            <div className="text-lg font-semibold">
              Trial <span data-testid="text-current-trial">{currentTrial}</span> of{' '}
              <span data-testid="text-total-trials">{settings.trialCount}</span>
            </div>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-dark-surface">
        <div className="max-w-md mx-auto">
          <Progress
            data-testid="progress-trials"
            value={progress}
            className="h-1 bg-dark-elevated"
          />
        </div>
      </div>

      {/* Test Area */}
      <div className="flex-1 relative">
        {/* Waiting State */}
        {testState === 'waiting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-dark-elevated rounded-full flex items-center justify-center mb-6">
              <Clock className="text-2xl text-secondary" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Ready</h3>
            <p className="text-secondary mb-8">
              Position your finger over the screen.{' '}
              {testType === 'visual'
                ? 'The screen will flash when it\'s time to react.'
                : 'You\'ll hear a beep when it\'s time to react.'}
            </p>
            <Button
              data-testid="button-start-trial"
              onClick={startTrial}
              className="bg-electric-blue hover:bg-electric-blue-dark text-[var(--dark-bg)] font-semibold py-3 px-8 rounded-xl"
            >
              Start Trial
            </Button>
          </div>
        )}

        {/* Ready State */}
        {testState === 'ready' && (
          <div className="absolute inset-0 bg-dark-elevated flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">👀</div>
              <div className="text-lg font-semibold text-secondary">Wait for it...</div>
            </div>
          </div>
        )}

        {/* Visual Stimulus */}
        {testState === 'stimulus' && testType === 'visual' && (
          <div
            data-testid="stimulus-visual"
            className="absolute inset-0 bg-electric-blue flex items-center justify-center cursor-pointer"
            onTouchStart={recordReaction}
            onMouseDown={recordReaction}
          >
            <div className="text-center text-[var(--dark-bg)]">
              <Zap size={96} className="mx-auto mb-4" />
              <div className="text-2xl font-bold">TAP NOW!</div>
            </div>
          </div>
        )}

        {/* Auditory Stimulus */}
        {testState === 'stimulus' && testType === 'auditory' && (
          <div
            data-testid="stimulus-auditory"
            className="absolute inset-0 bg-vibrant-green flex items-center justify-center cursor-pointer"
            onTouchStart={recordReaction}
            onMouseDown={recordReaction}
          >
            <div className="text-center text-[var(--dark-bg)]">
              <Volume2 size={96} className="mx-auto mb-4" />
              <div className="text-2xl font-bold">TAP NOW!</div>
            </div>
          </div>
        )}

        {/* Result State */}
        {testState === 'result' && trialData.reactionTime && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-6">
              <Check className="text-2xl text-white" size={32} />
            </div>
            <div data-testid="text-reaction-time" className="text-4xl font-bold mb-2">
              {Math.round(trialData.reactionTime)}ms
            </div>
            <div className="text-secondary mb-8">Reaction Time</div>
            
            {/* Performance Indicator */}
            <div className="bg-dark-surface rounded-lg p-4 mb-6 w-full max-w-sm">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-secondary">Performance</span>
                <span
                  data-testid="text-performance"
                  className={`font-semibold ${getPerformanceColor(trialData.reactionTime, testType)}`}
                >
                  {getPerformanceRating(trialData.reactionTime, testType)}
                </span>
              </div>
              <div className="text-xs text-secondary">
                {getPerformanceInsight(trialData.reactionTime, testType)}
              </div>
            </div>

            <Button
              data-testid="button-next-trial"
              onClick={nextTrial}
              className="bg-electric-blue hover:bg-electric-blue-dark text-[var(--dark-bg)] font-semibold py-3 px-8 rounded-xl"
            >
              {currentTrial >= settings.trialCount ? 'View Results' : 'Next Trial'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
