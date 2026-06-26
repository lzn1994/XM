import type { StyleResult, UserSession, BudgetBreakdown, FloorPlanData, NianProgress, DemoMode, SopStep } from '../types';
import { calculateBudgetBreakdown, getCityTier } from './budget-data';
import { defaultStyleResult } from './style-quiz';
import { sopSteps } from './sop-steps';
import { equipmentList } from './nian-data';

export const demoStyleResult: StyleResult = {
  ...defaultStyleResult,
};

export const demoFloorPlan: FloorPlanData = {
  rooms: 3,
  area: 100,
  layout: '三室两厅一卫',
};

export const demoBudgetTotal = 200000;

export const demoCity = '杭州';

export const demoBudgetBreakdown: BudgetBreakdown = calculateBudgetBreakdown(
  demoBudgetTotal,
  getCityTier(demoCity)
);

export const demoUserSession: UserSession = {
  styleResult: demoStyleResult,
  budgetTotal: demoBudgetTotal,
  budgetBreakdown: demoBudgetBreakdown,
  city: demoCity,
  area: 100,
  specialNeeds: ['老人房', '收纳空间'],
  floorPlan: demoFloorPlan,
};

export const demoCurrentStepId = 3;

export function getDemoSopSteps(): SopStep[] {
  return sopSteps.map((step) => ({
    ...step,
    status: step.id < demoCurrentStepId
      ? 'completed'
      : step.id === demoCurrentStepId
      ? 'current'
      : 'locked',
  }));
}

export const demoBudgetHealth = 'healthy';

export const demoNianProgress: NianProgress = {
  level: 6,
  spiritPoints: 650,
  jadeStones: 320,
  houseScore: 150,
  streakDays: 7,
  equipment: [equipmentList[1]],
  emotion: 'happy',
};

export const demoMode: DemoMode = {
  isActive: false,
  currentChapter: 1,
  progress: 15,
};

export const demoChapters = [
  {
    id: 1,
    title: '风格探测',
    description: '完成风格测试，找到你的理想家',
    steps: ['填写基本信息', '完成5道风格题', '查看风格结果'],
  },
  {
    id: 2,
    title: '预算规划',
    description: '智能拆解预算，花钱明明白白',
    steps: ['输入总预算', '选择城市', '查看532拆解', '了解阶段释放'],
  },
  {
    id: 3,
    title: 'SOP流程',
    description: '20步装修全流程，步步有AI陪伴',
    steps: ['查看20步SOP', '体验AI合同鉴别', '了解验收节点'],
  },
  {
    id: 4,
    title: '年兽养成',
    description: '和年兽一起成长，装修不孤单',
    steps: ['认识年兽', '收集装备', '升级房子'],
  },
];

export function getDemoData() {
  return {
    userSession: demoUserSession,
    styleResult: demoStyleResult,
    budgetBreakdown: demoBudgetBreakdown,
    sopSteps: getDemoSopSteps(),
    currentStepId: demoCurrentStepId,
    budgetHealth: demoBudgetHealth,
    nianProgress: demoNianProgress,
    demoMode: { ...demoMode, isActive: true },
  };
}

export function resetDemoData() {
  return getDemoData();
}
