import { ArrowLeft, Mail, Github, GraduationCap, MapPin, Award, Target, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  const handleContactClick = (type: 'email' | 'github' | 'scholar') => {
    const urls = {
      email: 'mailto:salahallioui01@gmail.com',
      github: 'https://github.com/Salahalioui',
      scholar: 'https://scholar.google.com/citations?user=search&q=Alioui+Salah+Dine'
    };
    
    if (navigator.share && window.innerWidth <= 768) {
      navigator.share({
        title: 'Contact Alioui Salah Dine',
        url: urls[type]
      });
    } else {
      window.open(urls[type], '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-dark-surface p-4 border-b border-dark-elevated">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            data-testid="button-back-about"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-dark-elevated"
          >
            <ArrowLeft className="text-secondary" size={20} />
          </Button>
          <div className="text-center">
            <div className="text-lg font-semibold">About the Developer</div>
            <div className="text-sm text-secondary">Scientific Foundation</div>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Profile Card */}
          <Card className="bg-dark-surface border-dark-elevated">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-[var(--dark-bg)]" size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2">Alioui Salah Dine</h1>
                <div className="space-y-1 mb-4">
                  <Badge className="bg-electric-blue text-[var(--dark-bg)] font-semibold">
                    Ph.D. in Sport Sciences (2025)
                  </Badge>
                  <div className="text-sm text-secondary">Elite Sports Training Specialization</div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-secondary mb-4">
                  <MapPin size={16} />
                  <span>El Bayadh, Algeria</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="border-vibrant-green text-vibrant-green">
                    Researcher
                  </Badge>
                  <Badge variant="outline" className="border-vibrant-green text-vibrant-green">
                    Sports Technologist
                  </Badge>
                  <Badge variant="outline" className="border-vibrant-green text-vibrant-green">
                    Developer
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="bg-dark-surface border-dark-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-electric-blue" size={20} />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="selectable-text">
              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  I am a sport science researcher from El Bayadh, Algeria, with a doctoral 
                  specialization in elite athletic training. My academic and field experience 
                  spans multiple disciplines, including volleyball and youth athletic development.
                </p>
                <p>
                  This application was developed to bridge the gap between scientific research 
                  and real-world sports practice—particularly in under-resourced settings. It 
                  offers athletes and coaches an accessible, evidence-based platform for measuring 
                  and training reaction time using nothing more than standard smartphones.
                </p>
                <p>
                  My work focuses on merging sports science with digital technology through 
                  low-cost, scalable solutions to enhance testing, analysis, and personalized 
                  training feedback.
                </p>
                <p>
                  Although inspired by practical needs in Algerian sport contexts, this tool 
                  is designed for multidisciplinary use in research, training, and performance 
                  optimization across various sports domains.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <Card className="bg-dark-surface border-dark-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-vibrant-green" size={20} />
                Mission Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-dark-elevated rounded-lg p-4 text-center">
                <div className="text-lg font-semibold mb-2 electric-blue">
                  "Every athlete deserves access to valid, affordable performance tools—regardless of geography or funding."
                </div>
                <div className="text-sm text-secondary">
                  Democratizing sports science through accessible technology
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Focus */}
          <Card className="bg-dark-surface border-dark-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="text-electric-blue" size={20} />
                Research Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="bg-dark-elevated rounded-lg p-3">
                  <div className="font-semibold text-sm mb-1">Elite Athletic Training</div>
                  <div className="text-xs text-secondary">
                    Performance optimization methodologies for high-level athletes
                  </div>
                </div>
                <div className="bg-dark-elevated rounded-lg p-3">
                  <div className="font-semibold text-sm mb-1">Volleyball Performance</div>
                  <div className="text-xs text-secondary">
                    Reaction time analysis and training protocols for volleyball players
                  </div>
                </div>
                <div className="bg-dark-elevated rounded-lg p-3">
                  <div className="font-semibold text-sm mb-1">Youth Development</div>
                  <div className="text-xs text-secondary">
                    Age-appropriate training methods and performance assessment
                  </div>
                </div>
                <div className="bg-dark-elevated rounded-lg p-3">
                  <div className="font-semibold text-sm mb-1">Sports Technology</div>
                  <div className="text-xs text-secondary">
                    Digital solutions for accessible sports science applications
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Links */}
          <Card className="bg-dark-surface border-dark-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="text-vibrant-green" size={20} />
                Contact & Research Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  data-testid="button-contact-email"
                  onClick={() => handleContactClick('email')}
                  variant="outline"
                  className="w-full justify-start border-dark-elevated hover:bg-dark-elevated"
                >
                  <Mail className="text-electric-blue mr-3" size={18} />
                  <div className="text-left">
                    <div className="font-semibold">Email</div>
                    <div className="text-xs text-secondary">salahallioui01@gmail.com</div>
                  </div>
                </Button>
                
                <Button
                  data-testid="button-contact-github"
                  onClick={() => handleContactClick('github')}
                  variant="outline"
                  className="w-full justify-start border-dark-elevated hover:bg-dark-elevated"
                >
                  <Github className="text-electric-blue mr-3" size={18} />
                  <div className="text-left">
                    <div className="font-semibold">GitHub</div>
                    <div className="text-xs text-secondary">Salahalioui</div>
                  </div>
                </Button>
                
                <Button
                  data-testid="button-contact-scholar"
                  onClick={() => handleContactClick('scholar')}
                  variant="outline"
                  className="w-full justify-start border-dark-elevated hover:bg-dark-elevated"
                >
                  <GraduationCap className="text-electric-blue mr-3" size={18} />
                  <div className="text-left">
                    <div className="font-semibold">Google Scholar</div>
                    <div className="text-xs text-secondary">Alioui Salah Dine</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="bg-dark-surface border-dark-elevated">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-xs text-secondary mb-2">
                  Reaction Time Trainer v1.0
                </div>
                <div className="text-xs text-secondary">
                  Built with scientific rigor for accessible sports performance testing
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}