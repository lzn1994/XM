import { useAppState } from './hooks/useAppState';
import OnboardingView from './views/OnboardingView';
import SOPView from './views/SOPView';
import BudgetView from './views/BudgetView';
import NianView from './views/NianView';

function App() {
  const { state } = useAppState();

  const renderView = () => {
    switch (state.currentView) {
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
        return <OnboardingView />;
    }
  };

  return <div className="min-h-screen bg-[var(--color-background)]">{renderView()}</div>;
}

export default App;
