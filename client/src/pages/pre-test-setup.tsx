import { useState } from 'react';
import { Check, Volume2, Eye, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TestType } from '@/types/test';

interface PreTestSetupProps {
  testType: TestType;
  onComplete: (isReady: boolean) => void;
  onCancel: () => void;
}

interface SetupChecks {
  position: boolean;
  environment: boolean;
  readiness: boolean;
  volume?: boolean;
}

export function PreTestSetupPage({ testType, onComplete, onCancel }: PreTestSetupProps) {
  const [checks, setChecks] = useState<SetupChecks>({
    position: false,
    environment: false,
    readiness: false,
    volume: testType.includes('auditory') ? false : undefined
  });
  const [showVolumeTest, setShowVolumeTest] = useState(false);

  const handleCheck = (checkType: keyof SetupChecks) => {
    setChecks(prev => ({
      ...prev,
      [checkType]: !prev[checkType]
    }));
  };

  const handleVolumeTest = () => {
    setShowVolumeTest(true);
    // Play test beep
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
    
    setTimeout(() => {
      setShowVolumeTest(false);
      setChecks(prev => ({ ...prev, volume: true }));
    }, 1000);
  };

  const isReadyForTest = () => {
    const requiredChecks = testType.includes('auditory') 
      ? ['position', 'environment', 'readiness', 'volume']
      : ['position', 'environment', 'readiness'];
    
    return requiredChecks.every(check => checks[check as keyof SetupChecks]);
  };

  const getTestTypeDisplay = () => {
    if (testType.includes('choice')) {
      return testType.includes('auditory') ? 'Choice Auditory' : 'Choice Visual';
    }
    return testType.includes('auditory') ? 'Auditory' : 'Visual';
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
          {testType.includes('auditory') ? (
            <Volume2 className="text-[var(--dark-bg)]" size={32} />
          ) : (
            <Eye className="text-[var(--dark-bg)]" size={32} />
          )}
        </div>
        <h1 className="text-xl font-bold mb-2">Test Setup</h1>
        <p className="text-secondary">{getTestTypeDisplay()} Reaction Time Test</p>
      </div>

      {/* Setup Checklist */}
      <Card className="bg-dark-surface border-dark-elevated">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold">Quick Setup Checklist</h3>
          
          {/* Position Check */}
          <div 
            className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg cursor-pointer"
            onClick={() => handleCheck('position')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                checks.position ? 'bg-electric-blue border-electric-blue' : 'border-gray-400'
              }`}>
                {checks.position && <Check size={12} className="text-[var(--dark-bg)]" />}
              </div>
              <div>
                <div className="text-sm font-medium">Comfortable Position</div>
                <div className="text-xs text-secondary">Device at arm's length, sitting upright</div>
              </div>
            </div>
          </div>

          {/* Environment Check */}
          <div 
            className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg cursor-pointer"
            onClick={() => handleCheck('environment')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                checks.environment ? 'bg-electric-blue border-electric-blue' : 'border-gray-400'
              }`}>
                {checks.environment && <Check size={12} className="text-[var(--dark-bg)]" />}
              </div>
              <div>
                <div className="text-sm font-medium">Quiet Environment</div>
                <div className="text-xs text-secondary">Good lighting, minimal distractions</div>
              </div>
            </div>
          </div>

          {/* Volume Check (Auditory only) */}
          {testType.includes('auditory') && (
            <div className="p-3 bg-dark-elevated rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    checks.volume ? 'bg-electric-blue border-electric-blue' : 'border-gray-400'
                  }`}>
                    {checks.volume && <Check size={12} className="text-[var(--dark-bg)]" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Volume Check</div>
                    <div className="text-xs text-secondary">Test audio clarity</div>
                  </div>
                </div>
                {!checks.volume && (
                  <Button
                    size="sm"
                    onClick={handleVolumeTest}
                    disabled={showVolumeTest}
                    className="bg-vibrant-green hover:bg-vibrant-green-dark text-[var(--dark-bg)]"
                  >
                    {showVolumeTest ? 'Playing...' : 'Test Sound'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Readiness Check */}
          <div 
            className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg cursor-pointer"
            onClick={() => handleCheck('readiness')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                checks.readiness ? 'bg-electric-blue border-electric-blue' : 'border-gray-400'
              }`}>
                {checks.readiness && <Check size={12} className="text-[var(--dark-bg)]" />}
              </div>
              <div>
                <div className="text-sm font-medium">Ready & Alert</div>
                <div className="text-xs text-secondary">Feeling focused and prepared</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-dark-surface border-dark-elevated">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Test Instructions</h3>
          <div className="space-y-2 text-sm text-secondary">
            {testType.includes('choice') ? (
              testType.includes('auditory') ? (
                <>
                  <p>• High tone = Tap LEFT side of screen</p>
                  <p>• Low tone = Tap RIGHT side of screen</p>
                  <p>• React as quickly as possible when you hear the sound</p>
                  <p>• Accuracy matters - wrong responses will be noted</p>
                </>
              ) : (
                <>
                  <p>• Blue screen = Tap LEFT side</p>
                  <p>• Green screen = Tap RIGHT side</p>
                  <p>• React as quickly as possible when colors appear</p>
                  <p>• Accuracy matters - wrong responses will be noted</p>
                </>
              )
            ) : (
              <>
                <p>• Wait for the {testType.includes('auditory') ? 'sound' : 'color change'}</p>
                <p>• Tap the screen as quickly as possible</p>
                <p>• Don't anticipate - wait for the signal</p>
                <p>• Stay focused throughout all trials</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          data-testid="button-start-test"
          onClick={() => onComplete(true)}
          disabled={!isReadyForTest()}
          className="w-full bg-electric-blue hover:bg-electric-blue-dark text-[var(--dark-bg)] font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Start Test
        </Button>
        
        <Button
          data-testid="button-cancel-setup"
          onClick={() => onCancel()}
          variant="ghost"
          className="w-full text-secondary hover:text-text-primary font-medium py-3 px-6 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Warning for incomplete setup */}
      {!isReadyForTest() && (
        <div className="flex items-center space-x-2 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
          <AlertTriangle className="text-yellow-400" size={16} />
          <p className="text-xs text-yellow-400">
            Complete all checklist items to ensure accurate results
          </p>
        </div>
      )}
    </div>
  );
}