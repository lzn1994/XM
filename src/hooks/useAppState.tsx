import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { StyleResult, FloorPlanData, BudgetBreakdown, NianProgress } from '../types';

export type ViewType = 'hero' | 'onboarding' | 'sop' | 'budget' | 'nian' | 'demo';

interface UserSession {
  id?: string;
  name?: string;
  isLoggedIn: boolean;
  styleResult: StyleResult | null;
  budgetTotal: number;
  budgetBreakdown: BudgetBreakdown | null;
  city: string;
  area: number;
  specialNeeds: string[];
  floorPlan: FloorPlanData | null;
}

interface SOPProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  stageUnlockStatus: boolean[];
}



interface AppState {
  currentView: ViewType;
  userSession: UserSession;
  sopProgress: SOPProgress;
  nianProgress: NianProgress;
  demoMode: boolean;
}

type AppAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_USER_SESSION'; payload: UserSession }
  | { type: 'UPDATE_USER_SESSION'; payload: Partial<UserSession> }
  | { type: 'UPDATE_SOP_PROGRESS'; payload: Partial<SOPProgress> }
  | { type: 'UPDATE_NIAN_PROGRESS'; payload: Partial<NianProgress> }
  | { type: 'TOGGLE_DEMO_MODE' }
  | { type: 'RESET_STATE' };

const STORAGE_KEY = 'renovation_app_state';

const initialState: AppState = {
  currentView: 'hero',
  userSession: {
    isLoggedIn: false,
    styleResult: null,
    budgetTotal: 0,
    budgetBreakdown: null,
    city: '',
    area: 0,
    specialNeeds: [],
    floorPlan: null,
  },
  sopProgress: {
    currentStep: 1,
    totalSteps: 20,
    completedSteps: [],
    stageUnlockStatus: [true, false, false, false, false, false],
  },
  nianProgress: {
    level: 1,
    spiritPoints: 0,
    jadeStones: 100,
    houseScore: 0,
    streakDays: 0,
    equipment: [],
    emotion: 'happy',
  },
  demoMode: false,
};

const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }
  return initialState;
};

const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_USER_SESSION':
      return { ...state, userSession: action.payload };
    case 'UPDATE_USER_SESSION':
      return { ...state, userSession: { ...state.userSession, ...action.payload } };
    case 'UPDATE_SOP_PROGRESS':
      return { ...state, sopProgress: { ...state.sopProgress, ...action.payload } };
    case 'UPDATE_NIAN_PROGRESS':
      return { ...state, nianProgress: { ...state.nianProgress, ...action.payload } };
    case 'TOGGLE_DEMO_MODE':
      return { ...state, demoMode: !state.demoMode };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setView: (view: ViewType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setView = (view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, setView }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export default useAppState;
