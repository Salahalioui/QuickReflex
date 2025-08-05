import { useState, useEffect } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotFound from "@/pages/not-found";
import { HomePage } from '@/pages/home';
import { TestPage } from '@/pages/test';
import { ResultsPage } from '@/pages/results';
import { SciencePage } from '@/pages/science';
import { AboutPage } from '@/pages/about';
import { AllResultsPage } from '@/pages/all-results';
import { SettingsModal } from '@/components/settings-modal';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { TestType, TestSession, TestSettings, PersonalBest, TrialData, TestResult } from '@/types/test';
import { calculateSessionStats, updatePersonalBest } from '@/lib/test-utils';

const defaultSettings: TestSettings = {
  trialCount: 10,  // Sports science recommended standard
  volume: 80,
  haptics: true
};

const defaultPersonalBest: PersonalBest = {
  visual: null,
  auditory: null
};

function Router() {
  const [currentView, setCurrentView] = useState<'home' | 'test' | 'results' | 'science' | 'about' | 'all-results'>('home');
  const [currentTestType, setCurrentTestType] = useState<TestType>('visual');
  const [currentSession, setCurrentSession] = useState<TestSession | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const [sessions, setSessions] = useLocalStorage<TestSession[]>('reaction-test-sessions', []);
  const [settings, setSettings] = useLocalStorage<TestSettings>('reaction-test-settings', defaultSettings);
  const [personalBest, setPersonalBest] = useLocalStorage<PersonalBest>('reaction-test-personal-best', defaultPersonalBest);

  const handleStartTest = (type: TestType) => {
    setCurrentTestType(type);
    setCurrentView('test');
  };

  const handleTestComplete = (results: TrialData[]) => {
    // Convert TrialData to TestResult
    const testResults: TestResult[] = results.map((trial, index) => ({
      id: `${Date.now()}-${index}`,
      type: currentTestType,
      reactionTime: trial.reactionTime || 0,
      timestamp: Date.now()
    }));

    const stats = calculateSessionStats(testResults);
    
    const session: TestSession = {
      id: `session-${Date.now()}`,
      type: currentTestType,
      results: testResults,
      average: stats.average,
      best: stats.best,
      worst: stats.worst,
      consistency: stats.consistency,
      timestamp: Date.now(),
      trialCount: settings.trialCount,
      validTrials: stats.validTrials,
      excludedOutliers: stats.excludedOutliers,
      warmupCompleted: true
    };

    // Update sessions
    setSessions(prev => [session, ...prev].slice(0, 50)); // Keep last 50 sessions
    
    // Update personal best
    const newPersonalBest = updatePersonalBest(personalBest, session);
    setPersonalBest(newPersonalBest);
    
    setCurrentSession(session);
    setCurrentView('results');
  };

  const handleTestAgain = () => {
    setCurrentView('test');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentSession(null);
  };

  const handleExitTest = () => {
    setCurrentView('home');
  };

  const handleClearData = () => {
    setSessions([]);
    setPersonalBest(defaultPersonalBest);
    setShowSettings(false);
  };

  const handleViewAllResults = () => {
    setCurrentView('all-results');
  };

  const handleViewScience = () => {
    setCurrentView('science');
  };

  const handleBackFromScience = () => {
    setCurrentView('home');
  };

  const handleViewAbout = () => {
    console.log('About button clicked - navigating to about page');
    setCurrentView('about');
  };

  const handleBackFromAbout = () => {
    setCurrentView('home');
  };

  const handleBackFromAllResults = () => {
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-dark-surface border-b border-dark-elevated p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Reaction Tester</h1>
          <Button
            data-testid="button-toggle-settings"
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-dark-elevated transition-colors"
          >
            <Settings className="text-secondary" size={20} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentView === 'home' && (
          <HomePage
            personalBest={personalBest}
            recentSessions={sessions}
            onStartTest={handleStartTest}
            onViewAllResults={handleViewAllResults}
            onViewScience={handleViewScience}
            onViewAbout={handleViewAbout}
          />
        )}
        
        {currentView === 'test' && (
          <TestPage
            testType={currentTestType}
            settings={settings}
            onComplete={handleTestComplete}
            onExit={handleExitTest}
          />
        )}
        
        {currentView === 'results' && currentSession && (
          <ResultsPage
            session={currentSession}
            onTestAgain={handleTestAgain}
            onBackToHome={handleBackToHome}
          />
        )}
        
        {currentView === 'science' && (
          <SciencePage
            onBack={handleBackFromScience}
          />
        )}
        
        {currentView === 'about' && (
          <AboutPage
            onBack={handleBackFromAbout}
          />
        )}
        
        {currentView === 'all-results' && (
          <AllResultsPage
            sessions={sessions}
            onBack={handleBackFromAllResults}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onClearData={handleClearData}
      />

      <Toaster />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={Router} />
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
