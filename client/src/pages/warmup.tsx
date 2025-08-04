import { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Clock, Zap, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface WarmupPageProps {
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const warmupStages = [
  {
    id: 'introduction',
    title: 'Warm-up Protocol',
    description: 'Following volleyball research protocols, a proper warm-up improves reaction time by up to 40ms.',
    duration: 30,
    icon: Flame,
    instructions: 'Prepare to begin your scientific warm-up sequence'
  },
  {
    id: 'joints',
    title: 'Joint Mobility',
    description: 'Gentle joint rotations prepare your nervous system',
    duration: 60,
    icon: Clock,
    instructions: 'Rotate wrists, shoulders, and ankles in slow circles'
  },
  {
    id: 'activation',
    title: 'Neural Activation',
    description: 'Quick finger movements activate reaction pathways',
    duration: 45,
    icon: Zap,
    instructions: 'Rapidly tap fingers on any surface - alternate hands'
  },
  {
    id: 'practice',
    title: 'Practice Trials',
    description: 'Familiarization trials ensure understanding',
    duration: 60,
    icon: Play,
    instructions: 'Practice 3-5 reaction taps when the screen flashes'
  }
];

export function WarmupPage({ onComplete, onSkip, onBack }: WarmupPageProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(warmupStages[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [practiceFlashes, setPracticeFlashes] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  const stage = warmupStages[currentStage];
  const progress = ((currentStage + 1) / warmupStages.length) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            if (currentStage < warmupStages.length - 1) {
              setCurrentStage(prev => prev + 1);
              setTimeRemaining(warmupStages[currentStage + 1].duration);
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, currentStage]);

  // Practice flash logic for final stage
  useEffect(() => {
    if (stage.id === 'practice' && isActive && practiceFlashes < 5) {
      const flashTimer = setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => {
          setShowFlash(false);
          setPracticeFlashes(prev => prev + 1);
        }, 200);
      }, Math.random() * 3000 + 2000);

      return () => clearTimeout(flashTimer);
    }
  }, [stage.id, isActive, practiceFlashes]);

  const handleStart = () => {
    setIsActive(true);
    if (stage.id === 'practice') {
      setPracticeFlashes(0);
    }
  };

  const handleNext = () => {
    if (currentStage < warmupStages.length - 1) {
      setCurrentStage(prev => prev + 1);
      setTimeRemaining(warmupStages[currentStage + 1].duration);
      setIsActive(false);
    } else {
      onComplete();
    }
  };

  const handlePracticeFlash = () => {
    if (showFlash) {
      setShowFlash(false);
      // Give positive feedback for practice
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-dark-surface p-4 border-b border-dark-elevated">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            data-testid="button-back-warmup"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-dark-elevated"
          >
            <ArrowLeft className="text-secondary" size={20} />
          </Button>
          <div className="text-center">
            <div className="text-lg font-semibold">Scientific Warm-up</div>
            <div className="text-sm text-secondary">Evidence-Based Protocol</div>
          </div>
          <Button
            data-testid="button-skip-warmup"
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-sm text-secondary hover:text-text-primary"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-dark-surface">
        <div className="max-w-md mx-auto">
          <Progress
            data-testid="progress-warmup"
            value={progress}
            className="h-1 bg-dark-elevated"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Stage Card */}
          <Card className="bg-dark-surface border-dark-elevated">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <stage.icon className="text-[var(--dark-bg)]" size={28} />
                </div>
                <h2 className="text-xl font-bold mb-2">{stage.title}</h2>
                <p className="text-secondary text-sm leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="bg-dark-elevated rounded-lg p-4 mb-6">
                <p className="text-sm text-center">
                  {stage.instructions}
                </p>
              </div>

              {/* Timer */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold electric-blue mb-2">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-secondary">
                  {isActive ? 'Active' : 'Ready to start'}
                </div>
              </div>

              {/* Practice Flash Area */}
              {stage.id === 'practice' && (
                <div 
                  className={`w-full h-32 rounded-lg mb-6 transition-colors duration-200 cursor-pointer ${
                    showFlash ? 'bg-electric-blue' : 'bg-dark-elevated'
                  }`}
                  onClick={handlePracticeFlash}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className={`text-center ${showFlash ? 'text-[var(--dark-bg)]' : 'text-secondary'}`}>
                      {showFlash ? (
                        <div>
                          <Zap size={32} className="mx-auto mb-2" />
                          <div className="font-bold">TAP NOW!</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm">Watch for flash</div>
                          <div className="text-xs mt-1">Practice {practiceFlashes}/5</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {!isActive ? (
                <Button
                  data-testid="button-start-stage"
                  onClick={handleStart}
                  className="w-full bg-electric-blue hover:bg-electric-blue-dark text-[var(--dark-bg)] font-semibold py-3 px-6 rounded-xl"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start {stage.title}
                </Button>
              ) : (
                <Button
                  data-testid="button-next-stage"
                  onClick={handleNext}
                  disabled={timeRemaining > 0 && (stage.id !== 'practice' || practiceFlashes < 5)}
                  className="w-full bg-vibrant-green hover:bg-vibrant-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-[var(--dark-bg)] font-semibold py-3 px-6 rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {currentStage === warmupStages.length - 1 ? 'Complete Warm-up' : 'Next Stage'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Scientific Note */}
          <Card className="bg-dark-surface border-dark-elevated">
            <CardContent className="p-4">
              <div className="text-xs text-secondary text-center">
                <strong>Research Note:</strong> Studies show proper warm-up protocols can improve 
                reaction time by 40ms on average. This sequence follows established sports science methodology.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}