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
    stimulusTime: 0,
    isValid: true,
    accuracy: true,
    expectedResponse: undefined,
    actualResponse: undefined
  });
  const [allResults, setAllResults] = useState<TrialData[]>([]);
  const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentStimulus, setCurrentStimulus] = useState<'left' | 'right' | 'high' | 'low' | 'none'>('none');
  const [invalidTrialMessage, setInvalidTrialMessage] = useState<string>('');
  
  const { playBeep } = useAudio();

  const isChoiceTest = testType.includes('choice');

  const resetTrial = useCallback(() => {
    // For choice tests, randomly select stimulus
    let expectedResponse: 'left' | 'right' | undefined = undefined;
    let stimulus: 'left' | 'right' | 'high' | 'low' | 'none' = 'none';
    
    if (isChoiceTest) {
      expectedResponse = Math.random() < 0.5 ? 'left' : 'right';
      if (testType === 'choice-visual') {
        stimulus = expectedResponse; // 'left' = blue, 'right' = green
      } else {
        stimulus = expectedResponse === 'left' ? 'high' : 'low'; // high tone = left, low tone = right
      }
    }
    
    setCurrentStimulus(stimulus);
    setInvalidTrialMessage('');
    setTrialData({
      trialNumber: currentTrial,
      reactionTime: null,
      startTime: 0,
      stimulusTime: 0,
      isValid: true,
      accuracy: true,
      expectedResponse,
      actualResponse: undefined
    });
  }, [currentTrial, isChoiceTest, testType]);

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
      } else if (testType === 'choice-auditory') {
        // Play high (1200Hz) or low (800Hz) tone based on current stimulus
        const frequency = currentStimulus === 'high' ? 1200 : 800;
        playBeep(frequency, 200, settings.volume / 100);
      }
    }, delay);
    
    setDelayTimeout(timeout);
  }, [testType, playBeep, settings.volume, resetTrial, currentStimulus]);

  const recordReaction = useCallback((responseType?: 'left' | 'right') => {
    if (testState === 'ready') {
      // Too early - false start
      setInvalidTrialMessage('Too early! Wait for the signal.');
      setTrialData(prev => ({ 
        ...prev, 
        isValid: false, 
        invalidReason: 'too-early',
        reactionTime: performance.now() - prev.startTime
      }));
      setTestState('result');
      return;
    }
    
    if (testState !== 'stimulus') return;
    
    const reactionTime = performance.now() - trialData.stimulusTime;
    
    // Validate reaction time
    let isValid = true;
    let invalidReason: 'too-early' | 'too-late' | 'wrong-response' | undefined = undefined;
    let accuracy = true;
    
    if (reactionTime < 150) {
      isValid = false;
      invalidReason = 'too-early';
      setInvalidTrialMessage('Too early! You may have anticipated the signal.');
    } else if (reactionTime > 1000) {
      isValid = false;
      invalidReason = 'too-late';
      setInvalidTrialMessage('Response too slow. Stay focused!');
    }
    
    // Check accuracy for choice tests
    if (isChoiceTest && responseType) {
      accuracy = responseType === trialData.expectedResponse;
      if (!accuracy) {
        setInvalidTrialMessage(`Wrong response! Expected ${trialData.expectedResponse}, got ${responseType}.`);
      }
    }
    
    const newTrialData = { 
      ...trialData, 
      reactionTime,
      isValid,
      accuracy,
      invalidReason,
      actualResponse: responseType
    };
    
    setTrialData(newTrialData);
    setTestState('result');
    
    // Vibrate if haptics enabled and valid trial
    if (settings.haptics && navigator.vibrate && isValid && accuracy) {
      navigator.vibrate(50);
    }
  }, [testState, trialData, settings.haptics, isChoiceTest]);

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

  // Event handlers for choice reactions
  const handleLeftResponse = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    recordReaction('left');
  }, [recordReaction]);

  const handleRightResponse = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    recordReaction('right');
  }, [recordReaction]);

  const handleSimpleResponse = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    recordReaction();
  }, [recordReaction]);

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
              {testType === 'visual' ? 'Visual Reaction Test' : 
               testType === 'choice-visual' ? 'Visual Choice Reaction' :
               testType === 'auditory' ? 'Auditory Reaction Test' : 
               'Auditory Choice Reaction'}
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
              {isChoiceTest ? (
                testType === 'choice-visual' 
                  ? 'Tap the colored circle that lights up - blue (left) or green (right).'
                  : 'Listen for the tone and tap the correct side - high tone (left) or low tone (right).'
              ) : (
                `Position your finger over the screen. ${
                  testType === 'visual'
                    ? 'The screen will flash when it\'s time to react.'
                    : 'You\'ll hear a beep when it\'s time to react.'
                }`
              )}
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

        {/* Simple Visual Stimulus */}
        {testState === 'stimulus' && testType === 'visual' && (
          <div
            data-testid="stimulus-visual"
            className="absolute inset-0 bg-electric-blue flex items-center justify-center cursor-pointer"
            onTouchStart={handleSimpleResponse}
            onMouseDown={handleSimpleResponse}
          >
            <div className="text-center text-[var(--dark-bg)]">
              <Zap size={96} className="mx-auto mb-4" />
              <div className="text-2xl font-bold">TAP NOW!</div>
            </div>
          </div>
        )}

        {/* Choice Visual Stimulus */}
        {testState === 'stimulus' && testType === 'choice-visual' && (
          <div className="absolute inset-0 flex">
            {/* Left side (Blue stimulus) */}
            <div 
              className={`flex-1 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                currentStimulus === 'left' ? 'bg-blue-500' : 'bg-dark-elevated opacity-50'
              }`}
              onTouchStart={handleLeftResponse}
              onMouseDown={handleLeftResponse}
              data-testid="stimulus-choice-left"
            >
              <div className="text-center">
                <div className={`text-6xl mb-4 ${currentStimulus === 'left' ? 'text-white' : 'text-secondary'}`}>●</div>
                <div className={`text-sm font-medium ${currentStimulus === 'left' ? 'text-white' : 'text-secondary'}`}>
                  BLUE
                </div>
              </div>
            </div>
            
            {/* Right side (Green stimulus) */}
            <div 
              className={`flex-1 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                currentStimulus === 'right' ? 'bg-green-500' : 'bg-dark-elevated opacity-50'
              }`}
              onTouchStart={handleRightResponse}
              onMouseDown={handleRightResponse}
              data-testid="stimulus-choice-right"
            >
              <div className="text-center">
                <div className={`text-6xl mb-4 ${currentStimulus === 'right' ? 'text-white' : 'text-secondary'}`}>●</div>
                <div className={`text-sm font-medium ${currentStimulus === 'right' ? 'text-white' : 'text-secondary'}`}>
                  GREEN
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple Auditory Stimulus */}
        {testState === 'stimulus' && testType === 'auditory' && (
          <div
            data-testid="stimulus-auditory"
            className="absolute inset-0 bg-vibrant-green flex items-center justify-center cursor-pointer"
            onTouchStart={handleSimpleResponse}
            onMouseDown={handleSimpleResponse}
          >
            <div className="text-center text-[var(--dark-bg)]">
              <Volume2 size={96} className="mx-auto mb-4" />
              <div className="text-2xl font-bold">TAP NOW!</div>
            </div>
          </div>
        )}

        {/* Choice Auditory Stimulus */}
        {testState === 'stimulus' && testType === 'choice-auditory' && (
          <div className="absolute inset-0 flex">
            {/* Left side (High tone) */}
            <div 
              className="flex-1 flex items-center justify-center cursor-pointer bg-purple-600"
              onTouchStart={handleLeftResponse}
              onMouseDown={handleLeftResponse}
              data-testid="stimulus-choice-high"
            >
              <div className="text-center text-white">
                <div className="text-4xl mb-4">🔊</div>
                <div className="text-lg font-medium">HIGH TONE</div>
                <div className="text-sm">TAP HERE</div>
              </div>
            </div>
            
            {/* Right side (Low tone) */}
            <div 
              className="flex-1 flex items-center justify-center cursor-pointer bg-orange-600"
              onTouchStart={handleRightResponse}
              onMouseDown={handleRightResponse}
              data-testid="stimulus-choice-low"
            >
              <div className="text-center text-white">
                <div className="text-4xl mb-4">🔉</div>
                <div className="text-lg font-medium">LOW TONE</div>
                <div className="text-sm">TAP HERE</div>
              </div>
            </div>
          </div>
        )}

        {/* Result State */}
        {testState === 'result' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            {/* Trial Validation Icon */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              trialData.isValid && trialData.accuracy 
                ? 'bg-green-600' 
                : trialData.isValid && !trialData.accuracy 
                ? 'bg-yellow-600' 
                : 'bg-red-600'
            }`}>
              {trialData.isValid && trialData.accuracy ? (
                <Check className="text-2xl text-white" size={32} />
              ) : trialData.isValid && !trialData.accuracy ? (
                <span className="text-2xl text-white">⚠</span>
              ) : (
                <span className="text-2xl text-white">✗</span>
              )}
            </div>

            {/* Invalid Trial Message */}
            {invalidTrialMessage && (
              <div className="text-red-400 text-lg font-medium mb-4 max-w-sm">
                {invalidTrialMessage}
              </div>
            )}

            {/* Reaction Time Display */}
            {trialData.reactionTime && (
              <>
                <div data-testid="text-reaction-time" className="text-4xl font-bold mb-2">
                  {Math.round(trialData.reactionTime)}ms
                </div>
                <div className="text-secondary mb-4">Reaction Time</div>
              </>
            )}

            {/* Choice Reaction Details */}
            {isChoiceTest && trialData.expectedResponse && (
              <div className="bg-dark-surface rounded-lg p-4 mb-4 w-full max-w-sm">
                <div className="text-sm mb-2">
                  <div className="flex justify-between">
                    <span className="text-secondary">Expected:</span>
                    <span className="capitalize">{trialData.expectedResponse}</span>
                  </div>
                  {trialData.actualResponse && (
                    <div className="flex justify-between">
                      <span className="text-secondary">Actual:</span>
                      <span className={`capitalize ${trialData.accuracy ? 'text-green-400' : 'text-red-400'}`}>
                        {trialData.actualResponse}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Performance Indicator - only for valid trials */}
            {trialData.isValid && trialData.accuracy && trialData.reactionTime && (
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
            )}

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
