export interface StyleResult {
  styleName: string;
  matchScore: number;
  tagline: string;
  tags: string[];
  description: string;
}

export interface FloorPlanData {
  rooms: number;
  area: number;
  layout: string;
}

export interface BudgetCategory {
  amount: number;
  ratio: number;
}

export interface StageBudget {
  stage: string;
  releaseRatio: number;
  amount: number;
  purpose: string;
  status: 'locked' | 'released' | 'spent';
}

export interface BudgetBreakdown {
  total: number;
  categories: {
    hardDecoration: BudgetCategory;
    mainMaterials: BudgetCategory;
    reserve: BudgetCategory;
  };
  stageRelease: StageBudget[];
  cityMultiplier: number;
}

export interface UserSession {
  styleResult: StyleResult | null;
  budgetTotal: number;
  budgetBreakdown: BudgetBreakdown | null;
  city: string;
  area: number;
  specialNeeds: string[];
  floorPlan: FloorPlanData | null;
}

export interface SopStep {
  id: number;
  title: string;
  stage: string;
  stageIndex: number;
  description: string;
  checklist: string[];
  aiTrigger: 'none' | 'auto' | 'forced';
  aiType: string;
  status: 'completed' | 'current' | 'locked';
  materialReminder?: string;
  styleTip?: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockLevel: number;
}

export interface HouseStage {
  stage: number;
  name: string;
  description: string;
  furniture: string[];
}

export interface NianProgress {
  level: number;
  spiritPoints: number;
  jadeStones: number;
  houseScore: number;
  streakDays: number;
  equipment: Equipment[];
  emotion: 'happy' | 'sleepy' | 'confused';
}

export interface DemoMode {
  isActive: boolean;
  currentChapter: number;
  progress: number;
}

export type StyleType = 'modern-chinese' | 'nordic' | 'japanese' | 'luxury' | 'industrial';

export interface StyleWeight {
  'modern-chinese': number;
  nordic: number;
  japanese: number;
  luxury: number;
  industrial: number;
}

export interface QuizOption {
  id: string;
  label: string;
  imageUrl?: string;
  weights: StyleWeight;
}

export interface QuizQuestion {
  id: number;
  title: string;
  type: 'image-single' | 'single';
  options: QuizOption[];
}

export interface MaterialCategory {
  name: string;
  budget: number;
  channel: string;
  lossFactor: number;
}

export type CityTier = 'tier1' | 'new-tier1' | 'tier2-3';
