import { Eye, Volume2, ChevronRight, Timer, Trophy, Brain, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TestSession, PersonalBest, TestType } from '@/types/test';

interface HomePageProps {
  personalBest: PersonalBest;
  recentSessions: TestSession[];
  onStartTest: (type: TestType) => void;
  onViewAllResults: () => void;
  onViewScience: () => void;
  onViewAbout: () => void;
}

export function HomePage({
  personalBest,
  recentSessions,
  onStartTest,
  onViewAllResults,
  onViewScience,
  onViewAbout
}: HomePageProps) {
  // Debug props on component render (can be removed in production)
  console.log('HomePage props:', { onViewAbout: typeof onViewAbout, onViewScience: typeof onViewScience });
  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <Timer className="text-2xl text-[var(--dark-bg)]" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Test Your Reflexes</h2>
        <p className="text-secondary text-sm leading-relaxed">
          Measure your reaction time with visual and auditory stimuli. Track your progress and challenge yourself to improve.
        </p>
      </div>

      {/* Quick Stats */}
      <Card className="bg-dark-surface border-dark-elevated">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-center">Personal Best</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div data-testid="text-visual-best" className="text-2xl font-bold electric-blue">
                {personalBest.visual ? `${personalBest.visual}ms` : '---'}
              </div>
              <div className="text-xs text-secondary">Visual</div>
            </div>
            <div className="text-center">
              <div data-testid="text-auditory-best" className="text-2xl font-bold vibrant-green">
                {personalBest.auditory ? `${personalBest.auditory}ms` : '---'}
              </div>
              <div className="text-xs text-secondary">Auditory</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold">Choose Test Type</h3>
        
        {/* Visual Test Button */}
        <Button
          data-testid="button-start-visual"
          onClick={() => onStartTest('visual')}
          className="w-full bg-electric-blue hover:bg-electric-blue-dark text-[var(--dark-bg)] font-semibold py-4 px-6 h-auto rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Eye size={20} />
            <div className="text-left">
              <div className="font-semibold">Visual Reaction Test</div>
              <div className="text-sm opacity-80">React to color changes</div>
            </div>
          </div>
          <ChevronRight size={16} />
        </Button>

        {/* Auditory Test Button */}
        <Button
          data-testid="button-start-auditory"
          onClick={() => onStartTest('auditory')}
          className="w-full bg-vibrant-green hover:bg-vibrant-green-dark text-[var(--dark-bg)] font-semibold py-4 px-6 h-auto rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Volume2 size={20} />
            <div className="text-left">
              <div className="font-semibold">Auditory Reaction Test</div>
              <div className="text-sm opacity-80">React to sound cues</div>
            </div>
          </div>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Scientific Background */}
      <div className="space-y-3">
        <Button
          data-testid="button-view-science"
          onClick={onViewScience}
          variant="outline"
          className="w-full bg-dark-surface hover:bg-dark-elevated border-dark-elevated text-text-primary font-medium py-3 px-6 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <Brain size={16} />
          Scientific Background
        </Button>
        
        <Button
          data-testid="button-view-about"
          onClick={() => {
            console.log('About button clicked in HomePage');
            console.log('onViewAbout function:', typeof onViewAbout, onViewAbout);
            if (typeof onViewAbout === 'function') {
              onViewAbout();
            } else {
              console.error('onViewAbout is not a function:', onViewAbout);
            }
          }}
          variant="outline"
          className="w-full bg-dark-surface hover:bg-dark-elevated border-dark-elevated text-text-primary font-medium py-3 px-6 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <User size={16} />
          About the Developer
        </Button>
      </div>

      {/* Recent Results */}
      {recentSessions.length > 0 && (
        <Card className="bg-dark-surface border-dark-elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Recent Sessions</h3>
              <Button
                data-testid="button-view-all"
                variant="link"
                className="text-electric-blue text-sm hover:underline p-0"
                onClick={onViewAllResults}
              >
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {recentSessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  data-testid={`row-session-${session.id}`}
                  className="flex items-center justify-between py-2 border-b border-dark-elevated last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        session.type === 'visual' ? 'bg-electric-blue' : 'bg-vibrant-green'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium">
                        {session.type === 'visual' ? 'Visual Test' : 'Auditory Test'}
                      </div>
                      <div className="text-xs text-secondary">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{session.average}ms</div>
                    <div className="text-xs text-secondary">{session.results.length} trials</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
