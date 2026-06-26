import type { Equipment, HouseStage, NianProgress } from '../types';

export const nianLevels = [
  { level: 1, name: '懵懂幼兽', minSpirit: 0, description: '刚刚来到你身边的小年兽，对一切都充满好奇' },
  { level: 6, name: '红绸少年', minSpirit: 500, description: '系上红绸带，开始陪伴你装修之旅' },
  { level: 12, name: '玉佩童子', minSpirit: 1500, description: '佩戴玉佩，变得更加灵动' },
  { level: 18, name: '云纹使者', minSpirit: 3000, description: '身披云纹披风，气场全开' },
  { level: 24, name: '守护灵兽', minSpirit: 5000, description: '传说中的守护灵兽，保佑家宅平安' },
];

export const equipmentList: Equipment[] = [
  {
    id: 'none',
    name: '无',
    description: '初始状态，还没有装备',
    icon: '',
    unlockLevel: 1,
  },
  {
    id: 'red-ribbon',
    name: '红绸带',
    description: '喜庆的红绸带，系在角上更显精神',
    icon: '🎀',
    unlockLevel: 6,
  },
  {
    id: 'jade-pendant',
    name: '玉佩',
    description: '温润的玉佩，蕴含着吉祥的祝福',
    icon: '💎',
    unlockLevel: 12,
  },
  {
    id: 'cloud-cloak',
    name: '云纹披风',
    description: '绣有云纹的华丽披风，气场十足',
    icon: '🧥',
    unlockLevel: 18,
  },
  {
    id: 'golden-bell',
    name: '金铃',
    description: '清脆的金铃，一响就能驱散霉运',
    icon: '🔔',
    unlockLevel: 24,
  },
];

export const houseStages: HouseStage[] = [
  {
    stage: 0,
    name: '前期准备',
    description: '毛坯空房，等待设计规划',
    furniture: ['毛坯空房', '户型分析台（条案）'],
  },
  {
    stage: 1,
    name: '主体拆改',
    description: '拆拆改改，空间格局初见雏形',
    furniture: ['设计图纸', '卷尺', '工具架', '安全告示牌'],
  },
  {
    stage: 2,
    name: '水电改造',
    description: '隐蔽工程进行中，水管电线铺起来',
    furniture: ['灯具', '插座', '合同审查台', '质检台'],
  },
  {
    stage: 3,
    name: '泥木工程',
    description: '青砖地面铺好，墙面刷白',
    furniture: ['青砖地面', '白墙', '圈椅', '茶几', '博古架'],
  },
  {
    stage: 4,
    name: '油工安装',
    description: '胡桃木色家具入场，温馨感',
    furniture: ['胡桃木家具', '格栅隔断', '落地灯', '绿植'],
  },
  {
    stage: 5,
    name: '收尾入住',
    description: '现代中式雅居，奖杯陈列',
    furniture: ['书法挂画', '瓷器摆件', '窗花', '奖杯'],
  },
];

export const emotionList = ['happy', 'sleepy', 'confused'] as const;

export const emotionMap = {
  happy: { name: '开心', emoji: '😊', description: '年兽今天心情很好，干活都更有力气了' },
  sleepy: { name: '打盹', emoji: '😴', description: '年兽有点困了，正在打盹休息' },
  confused: { name: '困惑', emoji: '🤔', description: '年兽遇到了难题，正在认真思考' },
};

export const initialNianProgress: NianProgress = {
  level: 1,
  spiritPoints: 0,
  jadeStones: 100,
  houseScore: 0,
  streakDays: 0,
  equipment: [],
  emotion: 'happy',
};

export function getLevelInfo(level: number) {
  let currentLevel = nianLevels[0];
  let nextLevel = nianLevels[1];

  for (let i = 0; i < nianLevels.length; i++) {
    if (level >= nianLevels[i].level) {
      currentLevel = nianLevels[i];
      nextLevel = nianLevels[i + 1] || nianLevels[nianLevels.length - 1];
    }
  }

  return { currentLevel, nextLevel };
}

export function getUnlockedEquipment(level: number): Equipment[] {
  return equipmentList.filter((eq) => eq.unlockLevel <= level && eq.id !== 'none');
}

export function getHouseStageBySopStep(stepId: number): HouseStage {
  if (stepId <= 3) return houseStages[0];
  if (stepId <= 6) return houseStages[1];
  if (stepId <= 10) return houseStages[2];
  if (stepId <= 14) return houseStages[3];
  if (stepId <= 17) return houseStages[4];
  return houseStages[5];
}

export function calculateSpiritGain(actionType: string): number {
  const gains: Record<string, number> = {
    'step-complete': 100,
    'daily-checkin': 20,
    'ai-use': 10,
    'budget-save': 50,
    'streak-bonus': 30,
  };
  return gains[actionType] || 10;
}
