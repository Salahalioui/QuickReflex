import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Target, TrendingUp, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestSession } from '@/types/test';
import { getPerformanceRating, getPerformanceColor } from '@/lib/test-utils';

interface AllResultsPageProps {
  sessions: TestSession[];
  onBack: () => void;
}

type FilterType = 'all' | 'visual' | 'auditory';
type SortType = 'newest' | 'oldest' | 'best' | 'worst';

export function AllResultsPage({ sessions, onBack }: AllResultsPageProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSortType] = useState<SortType>('newest');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  // Filter and sort sessions
  const filteredAndSortedSessions = sessions
    .filter(session => filter === 'all' || session.type === filter)
    .sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'best':
          return a.average - b.average;
        case 'worst':
          return b.average - a.average;
        default:
          return 0;
      }
    });

  const toggleSessionExpansion = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionStats = (session: TestSession) => {
    const times = session.results.map(r => r.reactionTime);
    const fastestTrial = Math.min(...times);
    const slowestTrial = Math.max(...times);
    const range = slowestTrial - fastestTrial;
    
    return {
      fastestTrial,
      slowestTrial,
      range
    };
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          data-testid="button-back"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-dark-surface"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-bold">All Test Sessions</h1>
          <p className="text-sm text-secondary">{sessions.length} total sessions</p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between space-x-3">
        {/* Filter */}
        <div className="flex space-x-2">
          <Button
            data-testid="filter-all"
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-electric-blue text-[var(--dark-bg)]' : 'bg-dark-surface border-dark-elevated'}
          >
            All
          </Button>
          <Button
            data-testid="filter-visual"
            variant={filter === 'visual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('visual')}
            className={filter === 'visual' ? 'bg-electric-blue text-[var(--dark-bg)]' : 'bg-dark-surface border-dark-elevated'}
          >
            Visual
          </Button>
          <Button
            data-testid="filter-auditory"
            variant={filter === 'auditory' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('auditory')}
            className={filter === 'auditory' ? 'bg-vibrant-green text-[var(--dark-bg)]' : 'bg-dark-surface border-dark-elevated'}
          >
            Auditory
          </Button>
        </div>

        {/* Sort */}
        <select
          data-testid="sort-sessions"
          value={sort}
          onChange={(e) => setSortType(e.target.value as SortType)}
          className="bg-dark-surface border border-dark-elevated rounded-lg px-3 py-1 text-sm text-text-primary"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="best">Best Average</option>
          <option value="worst">Worst Average</option>
        </select>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredAndSortedSessions.length === 0 ? (
          <Card className="bg-dark-surface border-dark-elevated">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-secondary mx-auto mb-3" />
              <p className="text-secondary">No sessions found</p>
              <p className="text-xs text-secondary mt-1">
                {filter !== 'all' ? `No ${filter} tests yet` : 'Start your first test to see results here'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedSessions.map((session) => {
            const isExpanded = expandedSession === session.id;
            const stats = getSessionStats(session);
            
            return (
              <Card key={session.id} className="bg-dark-surface border-dark-elevated">
                <CardContent className="p-4">
                  {/* Session Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        session.type === 'visual' ? 'bg-electric-blue' : 'bg-vibrant-green'
                      }`} />
                      <div>
                        <h3 className="font-semibold">
                          {session.type === 'visual' ? 'Visual Test' : 'Auditory Test'}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-secondary">
                          <Calendar size={12} />
                          <span>{formatDate(session.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      data-testid={`button-expand-${session.id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSessionExpansion(session.id)}
                      className="p-1"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </div>

                  {/* Session Summary */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-electric-blue">
                        {session.average}ms
                      </div>
                      <div className="text-xs text-secondary">Average</div>
                    </div>
                    <div className="text-center">
                      <Badge 
                        className={`${getPerformanceColor(session.average, session.type)} bg-transparent border-current text-xs`}
                      >
                        {getPerformanceRating(session.average, session.type)}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div>
                      <div className="font-semibold text-green-400">{session.best}ms</div>
                      <div className="text-secondary">Best</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-400">{session.worst}ms</div>
                      <div className="text-secondary">Worst</div>
                    </div>
                    <div>
                      <div className="font-semibold text-yellow-400">{session.consistency}%</div>
                      <div className="text-secondary">Consistency</div>
                    </div>
                  </div>

                  {/* Scientific Info */}
                  <div className="flex items-center justify-between text-xs text-secondary mb-3">
                    <span>{session.results.length} total trials</span>
                    {session.excludedOutliers > 0 && (
                      <span>{session.excludedOutliers} outliers excluded</span>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-dark-elevated pt-3 space-y-3">
                      {/* Detailed Stats */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-dark-elevated rounded-lg p-2">
                          <div className="text-secondary mb-1">Trial Range</div>
                          <div className="font-semibold">{Math.round(stats.range)}ms</div>
                        </div>
                        <div className="bg-dark-elevated rounded-lg p-2">
                          <div className="text-secondary mb-1">Valid Trials</div>
                          <div className="font-semibold">{session.validTrials}</div>
                        </div>
                      </div>

                      {/* Individual Trials */}
                      <div>
                        <div className="text-xs text-secondary mb-2">Individual Trials</div>
                        <div className="grid grid-cols-5 gap-1">
                          {session.results.map((result, index) => {
                            const isOutlier = result.reactionTime === stats.fastestTrial || 
                                            result.reactionTime === stats.slowestTrial;
                            return (
                              <div
                                key={result.id}
                                data-testid={`trial-${session.id}-${index + 1}`}
                                className={`text-center p-1 rounded text-xs font-mono ${
                                  isOutlier 
                                    ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-700/30' 
                                    : 'bg-dark-elevated text-text-primary'
                                }`}
                                title={`Trial ${index + 1}: ${Math.round(result.reactionTime)}ms${
                                  isOutlier ? ' (outlier)' : ''
                                }`}
                              >
                                {Math.round(result.reactionTime)}
                              </div>
                            );
                          })}
                        </div>
                        {session.excludedOutliers > 0 && (
                          <div className="text-xs text-secondary mt-1">
                            * Highlighted trials were excluded from average calculation
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {filteredAndSortedSessions.length > 0 && (
        <Card className="bg-dark-surface border-dark-elevated">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Summary Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <div className="text-lg font-bold text-electric-blue">
                  {Math.round(
                    filteredAndSortedSessions.reduce((sum, s) => sum + s.average, 0) / 
                    filteredAndSortedSessions.length
                  )}ms
                </div>
                <div className="text-xs text-secondary">Overall Average</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">
                  {Math.min(...filteredAndSortedSessions.map(s => s.best))}ms
                </div>
                <div className="text-xs text-secondary">Personal Best</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}