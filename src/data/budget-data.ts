import type { BudgetBreakdown, StageBudget, MaterialCategory, CityTier } from '../types';

export const budgetRules = {
  hardDecorationRatio: 0.5,
  mainMaterialsRatio: 0.3,
  reserveRatio: 0.2,
};

export const stageReleaseRatios = [
  { stage: '前期准备', ratio: 0.05, purpose: '设计费、定金' },
  { stage: '主体拆改', ratio: 0.1, purpose: '拆改、砌墙' },
  { stage: '水电改造', ratio: 0.2, purpose: '水电材料、人工' },
  { stage: '泥木工程', ratio: 0.25, purpose: '瓷砖、水泥、人工' },
  { stage: '油工安装', ratio: 0.25, purpose: '油漆、主材安装' },
  { stage: '收尾入住', ratio: 0.15, purpose: '洁具、灯具、保洁' },
];

export const cityMultipliers: Record<CityTier, number> = {
  tier1: 1.15,
  'new-tier1': 1.0,
  'tier2-3': 0.9,
};

export const cityTierMap: Record<string, CityTier> = {
  '北京': 'tier1',
  '上海': 'tier1',
  '广州': 'tier1',
  '深圳': 'tier1',
  '成都': 'new-tier1',
  '杭州': 'new-tier1',
  '重庆': 'new-tier1',
  '武汉': 'new-tier1',
  '西安': 'new-tier1',
  '苏州': 'new-tier1',
  '郑州': 'new-tier1',
  '南京': 'new-tier1',
  '天津': 'new-tier1',
  '长沙': 'new-tier1',
  '东莞': 'new-tier1',
  '佛山': 'new-tier1',
  '宁波': 'new-tier1',
  '青岛': 'new-tier1',
  '沈阳': 'new-tier1',
};

export const mainMaterialCategories: MaterialCategory[] = [
  {
    name: '瓷砖',
    budget: 15000,
    channel: '建材市场/线上',
    lossFactor: 1.05,
  },
  {
    name: '地板',
    budget: 12000,
    channel: '品牌专卖店',
    lossFactor: 1.08,
  },
  {
    name: '橱柜',
    budget: 20000,
    channel: '定制品牌',
    lossFactor: 1.0,
  },
  {
    name: '木门',
    budget: 8000,
    channel: '建材市场',
    lossFactor: 1.0,
  },
  {
    name: '洁具',
    budget: 10000,
    channel: '品牌专卖店',
    lossFactor: 1.0,
  },
];

export function calculateBudgetBreakdown(totalBudget: number, cityTier: CityTier): BudgetBreakdown {
  const multiplier = cityMultipliers[cityTier];
  const adjustedTotal = Math.round(totalBudget * multiplier);

  const hardDecorationAmount = Math.round(adjustedTotal * budgetRules.hardDecorationRatio);
  const mainMaterialsAmount = Math.round(adjustedTotal * budgetRules.mainMaterialsRatio);
  const reserveAmount = Math.round(adjustedTotal * budgetRules.reserveRatio);

  const stageRelease: StageBudget[] = stageReleaseRatios.map((item, index) => ({
    stage: item.stage,
    releaseRatio: item.ratio,
    amount: Math.round(adjustedTotal * item.ratio),
    purpose: item.purpose,
    status: index === 0 ? 'released' : index === 1 ? 'released' : 'locked',
  }));

  return {
    total: adjustedTotal,
    categories: {
      hardDecoration: {
        amount: hardDecorationAmount,
        ratio: budgetRules.hardDecorationRatio,
      },
      mainMaterials: {
        amount: mainMaterialsAmount,
        ratio: budgetRules.mainMaterialsRatio,
      },
      reserve: {
        amount: reserveAmount,
        ratio: budgetRules.reserveRatio,
      },
    },
    stageRelease,
    cityMultiplier: multiplier,
  };
}

export function getCityTier(city: string): CityTier {
  return cityTierMap[city] || 'new-tier1';
}

export function calculateMaterialBudget(totalBudget: number, categoryName: string): number {
  const category = mainMaterialCategories.find((c) => c.name === categoryName);
  if (!category) return 0;
  return Math.round(category.budget * (totalBudget / 200000));
}
