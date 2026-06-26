import { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import HeroView from './views/HeroView';
import OnboardingView from './views/OnboardingView';
import SOPView from './views/SOPView';
import BudgetView from './views/BudgetView';
import NianView from './views/NianView';
import Navigation from './components/Navigation';
import { DemoMode, DemoEntryOrb } from './demo';
import { InkParticles } from './components/animations';

function App() {
  const { state } = useAppState();
  const [isDemoActive, setIsDemoActive] = useState(false);

  const handleStartDemo = () => {
    setIsDemoActive(true);
  };

  const handleCloseDemo = () => {
    setIsDemoActive(false);
  };

  const renderView = () => {
    switch (state.currentView) {
      case 'hero':
        return <HeroView />;
      case 'onboarding':
        return <OnboardingView />;
      case 'sop':
        return <SOPView />;
      case 'budget':
        return <BudgetView />;
      case 'nian':
        return <NianView />;
      case 'demo':
        return <OnboardingView />;
      default:
        return <HeroView />;
    }
  };

  return (
    <div className="min-h-screen bg-mi-white">
      <style>{`
        @keyframes view-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .view-transition {
          animation: view-fade-in 300ms ease-out;
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--color-surface);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(74, 111, 165, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 111, 165, 0.5);
        }
        html {
          scroll-behavior: smooth;
        }
        .btn-click:active {
          transform: scale(0.97);
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <InkParticles />
      <Navigation>
        <div key={state.currentView} className="view-transition min-h-full">
          {renderView()}
        </div>
      </Navigation>
      {!isDemoActive && <DemoEntryOrb onClick={handleStartDemo} />}
      <DemoMode isActive={isDemoActive} onClose={handleCloseDemo} />
    </div>
  );
}

export default App;
