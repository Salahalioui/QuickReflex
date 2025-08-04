import { Trophy, Download, Share, RotateCcw, Home, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestSession } from '@/types/test';
import { exportToCSV, shareResults, getPerformanceRating, getPerformanceColor, getPerformanceInsight } from '@/lib/test-utils';

interface ResultsPageProps {
  session: TestSession;
  onTestAgain: () => void;
  onBackToHome: () => void;
}

export function ResultsPage({ session, onTestAgain, onBackToHome }: ResultsPageProps) {
  const handleExport = () => {
    exportToCSV(session);
  };

  const handleShare = async () => {
    try {
      await shareResults(session);
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  const getConsistencyColor = (consistency: number) => {
    if (consistency >= 80) return 'text-green-400';
    if (consistency >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="text-2xl text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Test Complete!</h2>
        <p className="text-secondary">Here are your results</p>
      </div>

      {/* Summary Stats */}
      <Card className="bg-dark-surface border-dark-elevated">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div data-testid="text-session-average" className="text-4xl font-bold electric-blue mb-1">
              {session.average}ms
            </div>
            <div className="text-secondary mb-3">Average Reaction Time</div>
            <Badge 
              variant="outline" 
              className={`${getPerformanceColor(session.average, session.type)} border-current`}
            >
              {getPerformanceRating(session.average, session.type)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div data-testid="text-best-time" className="text-lg font-semibold text-green-400">
                {session.best}ms
              </div>
              <div className="text-xs text-secondary">Best</div>
            </div>
            <div>
              <div data-testid="text-worst-time" className="text-lg font-semibold text-red-400">
                {session.worst}ms
              </div>
              <div className="text-xs text-secondary">Worst</div>
            </div>
            <div>
              <div
                data-testid="text-consistency"
                className={`text-lg font-semibold ${getConsistencyColor(session.consistency)}`}
              >
                {session.consistency}%
              </div>
              <div className="text-xs text-secondary">Consistency</div>
            </div>
          </div>
          
          <div className="bg-dark-elevated rounded-lg p-3">
            <div className="text-sm text-secondary text-center">
              {getPerformanceInsight(session.average, session.type)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Results */}
      <Card className="bg-dark-surface border-dark-elevated">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Trial Results</h3>
          <div className="space-y-2">
            {session.results.map((result, index) => (
              <div
                key={result.id}
                data-testid={`row-trial-${index + 1}`}
                className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center text-[var(--dark-bg)] text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="text-sm text-secondary">Trial {index + 1}</div>
                </div>
                <div className="text-lg font-semibold">{Math.round(result.reactionTime)}ms</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          data-testid="button-export-results"
          onClick={handleExport}
          variant="outline"
          className="w-full bg-dark-surface hover:bg-dark-elevated border-dark-elevated text-text-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200 active:scale-95"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Results (CSV)
        </Button>
        
        <Button
          data-testid="button-share-results"
          onClick={handleShare}
          className="w-full bg-electric-blue hover:bg-electric-blue-dark text-[var(--dark-bg)] font-semibold py-3 px-6 rounded-xl transition-all duration-200 active:scale-95"
        >
          <Share className="w-4 h-4 mr-2" />
          Share Results
        </Button>
        
        <Button
          data-testid="button-test-again"
          onClick={onTestAgain}
          className="w-full bg-vibrant-green hover:bg-vibrant-green-dark text-[var(--dark-bg)] font-semibold py-3 px-6 rounded-xl transition-all duration-200 active:scale-95"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Test Again
        </Button>
        
        <Button
          data-testid="button-back-to-home"
          onClick={onBackToHome}
          variant="ghost"
          className="w-full text-secondary hover:text-text-primary font-medium py-3 px-6 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
