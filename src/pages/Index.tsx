import { useAppState } from '@/hooks/useAppState';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { ConsentScreen } from '@/components/screens/ConsentScreen';
import { CheckinScreen } from '@/components/screens/CheckinScreen';
import { ContextScreen } from '@/components/screens/ContextScreen';
import { ResultsScreen } from '@/components/screens/ResultsScreen';
import { AnimatePresence } from 'framer-motion';

const Index = () => {
  const {
    state,
    setScreen,
    setCheckinData,
    setContextData,
    setFeedback,
    setConsent,
    resetState,
  } = useAppState();

  const handleGetStarted = () => {
    setScreen('consent');
  };

  const handleConsent = () => {
    setConsent(true);
    setScreen('checkin');
  };

  const handleCheckinComplete = () => {
    setScreen('context');
  };

  const handleAnalyze = () => {
    setScreen('results');
  };

  const handleStartOver = () => {
    resetState();
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {state.currentScreen === 'splash' && (
          <SplashScreen key="splash" onGetStarted={handleGetStarted} />
        )}
        {state.currentScreen === 'consent' && (
          <ConsentScreen
            key="consent"
            onConsent={handleConsent}
            onBack={() => setScreen('splash')}
          />
        )}
        {state.currentScreen === 'checkin' && (
          <CheckinScreen
            key="checkin"
            data={state.checkinData}
            onUpdate={setCheckinData}
            onComplete={handleCheckinComplete}
            onBack={() => setScreen('consent')}
          />
        )}
        {state.currentScreen === 'context' && (
          <ContextScreen
            key="context"
            data={state.contextData}
            onUpdate={setContextData}
            onAnalyze={handleAnalyze}
            onBack={() => setScreen('checkin')}
          />
        )}
        {state.currentScreen === 'results' && (
          <ResultsScreen
            key="results"
            checkinData={state.checkinData}
            contextData={state.contextData}
            feedbackData={state.feedbackData}
            onFeedback={setFeedback}
            onStartOver={handleStartOver}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
