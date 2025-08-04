import { ArrowLeft, Brain, Eye, Volume2, Target, Clock, Trophy, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SciencePageProps {
  onBack: () => void;
}

export function SciencePage({ onBack }: SciencePageProps) {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-surface p-4 border-b border-dark-elevated">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            data-testid="button-back-science"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-dark-elevated"
          >
            <ArrowLeft className="text-secondary" size={20} />
          </Button>
          <div className="text-center">
            <div className="text-lg font-semibold">Scientific Background</div>
            <div className="text-sm text-secondary">Evidence-Based Reaction Training</div>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Introduction */}
        <Card className="bg-dark-surface border-dark-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-electric-blue" size={20} />
              The Science of Reaction Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-secondary leading-relaxed">
              Reaction time is a fundamental measure of how quickly your nervous system can process 
              information and initiate a response. In sports like volleyball, where a powerful spike 
              can exceed 100 km/h and travel 9 meters in just 0.33 seconds, superior reaction skills 
              are the difference between success and failure.
            </p>
            <div className="bg-dark-elevated rounded-lg p-4">
              <h4 className="font-semibold mb-2">Key Insight</h4>
              <p className="text-sm text-secondary">
                At elite levels, it's "theoretically impossible to receive the ball" based purely on 
                reaction after contact. Players must rely on <strong>anticipation</strong> and 
                predictive cues to initiate movement before the ball is even struck.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visual vs Auditory */}
        <Card className="bg-dark-surface border-dark-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex gap-1">
                <Eye className="text-electric-blue" size={20} />
                <Volume2 className="text-vibrant-green" size={20} />
              </div>
              Visual vs. Auditory Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-secondary leading-relaxed">
              Research reveals significant differences between visual and auditory reaction times, 
              with important implications for training and performance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-elevated rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="text-electric-blue" size={16} />
                  <h4 className="font-semibold">Visual Reaction</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-secondary">Female Setters:</span>
                    <Badge variant="outline" className="electric-blue">236ms</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-secondary">Female Spikers:</span>
                    <Badge variant="outline" className="electric-blue">222ms</Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-elevated rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="text-vibrant-green" size={16} />
                  <h4 className="font-semibold">Auditory Reaction</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-secondary">Female Setters:</span>
                    <Badge variant="outline" className="vibrant-green">200ms</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-secondary">Female Spikers:</span>
                    <Badge variant="outline" className="vibrant-green">199ms</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-elevated rounded-lg p-4">
              <h4 className="font-semibold mb-2">The Auditory Advantage</h4>
              <p className="text-sm text-secondary">
                Studies show that auditory cues can be <strong>more predictive</strong> than visual cues. 
                The sound of ball-hand contact provides earlier, more reliable information about serve 
                characteristics than visual body kinematics alone.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Performance Benchmarks */}
        <Card className="bg-dark-surface border-dark-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-electric-blue" size={20} />
              Performance Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-secondary leading-relaxed">
              Understanding where your reaction times stand relative to elite athletes helps 
              set realistic goals and track meaningful progress.
            </p>
            
            <div className="space-y-4">
              <div className="bg-dark-elevated rounded-lg p-4">
                <h4 className="font-semibold mb-3">Elite Performance Standards</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-secondary mb-1">Excellent (Elite)</div>
                    <div className="text-lg font-bold text-green-400">{'<'} 200ms</div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary mb-1">Good (Competitive)</div>
                    <div className="text-lg font-bold text-yellow-400">200-250ms</div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary mb-1">Fair (Recreational)</div>
                    <div className="text-lg font-bold text-orange-400">250-300ms</div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary mb-1">Needs Practice</div>
                    <div className="text-lg font-bold text-red-400">{'>'} 300ms</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-elevated rounded-lg p-4">
                <h4 className="font-semibold mb-2">Training Insights</h4>
                <ul className="text-sm text-secondary space-y-2">
                  <li>• Warm-up improves reaction time by 40ms on average</li>
                  <li>• Auditory training can enhance defensive anticipation</li>
                  <li>• Consistency matters as much as raw speed</li>
                  <li>• Position-specific demands require targeted training</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Principles */}
        <Card className="bg-dark-surface border-dark-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="text-electric-blue" size={20} />
              Evidence-Based Training Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-dark-elevated rounded-lg p-4">
                <h4 className="font-semibold mb-2">Outlier Exclusion Protocol</h4>
                <p className="text-sm text-secondary">
                  Following volleyball research, fastest and slowest trials are excluded 
                  from averages to ensure reliable performance measurement.
                </p>
              </div>
              
              <div className="bg-dark-elevated rounded-lg p-4">
                <h4 className="font-semibold mb-2">Standard Trial Blocks</h4>
                <p className="text-sm text-secondary">
                  10-15 trials per session recommended by sports science research, 
                  with proper warm-up and rest intervals.
                </p>
              </div>
              
              <div className="bg-dark-elevated rounded-lg p-4">
                <h4 className="font-semibold mb-2">Choice vs Simple RT</h4>
                <p className="text-sm text-secondary">
                  Choice reaction time (multiple response options) develops decision-making 
                  under pressure, typically 50-100ms slower than simple RT.
                </p>
              </div>
              
              <div className="bg-dark-elevated rounded-lg p-4">
                <h4 className="font-semibold mb-2">Warm-up Protocol</h4>
                <p className="text-sm text-secondary">
                  5-12 minute structured warm-up can improve reaction time by 40ms. 
                  Includes joint mobility, neural activation, and practice trials.
                </p>
              </div>
              
              <div className="bg-dark-elevated rounded-lg p-4">
                <h4 className="font-semibold mb-2">6-Week Training Programs</h4>
                <p className="text-sm text-secondary">
                  Research shows 10-15% reaction time improvements over structured 
                  6-week programs with tech-enhanced training methods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research References */}
        <Card className="bg-dark-surface border-dark-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="text-electric-blue" size={20} />
              Scientific Foundation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-secondary text-sm leading-relaxed">
              This application is built on peer-reviewed research from sports science, 
              cognitive psychology, and motor learning literature. Key studies include:
            </p>
            <div className="space-y-2 text-xs text-secondary">
              <div>• Newtest 1000 volleyball player assessment data</div>
              <div>• Sors et al. audiovisual integration in serve prediction</div>
              <div>• Elite volleyball time-motion analysis studies</div>
              <div>• Cognitive psychology reaction time methodologies</div>
              <div>• Sports-specific anticipation and training transfer research</div>
            </div>
          </CardContent>
        </Card>

        <div className="pb-8">
          <Button
            data-testid="button-start-training"
            onClick={onBack}
            className="w-full bg-electric-blue hover:bg-electric-blue-dark text-[var(--dark-bg)] font-semibold py-3 px-6 rounded-xl"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Start Evidence-Based Training
          </Button>
        </div>
      </div>
    </div>
  );
}