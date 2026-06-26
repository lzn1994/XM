export interface DemoSpotlight {
  selector?: string;
  position?: { x: number; y: number; width: number; height: number };
  shape: 'circle' | 'rect';
  padding?: number;
}

export interface DemoNarration {
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface DemoAction {
  type: 'navigate' | 'dispatch' | 'wait' | 'custom';
  payload?: any;
}

export interface DemoBeat {
  id: string;
  duration: number;
  spotlight?: DemoSpotlight;
  narration?: DemoNarration;
  action?: DemoAction;
}

export interface DemoChapter {
  id: number;
  title: string;
  subtitle: string;
  duration: number;
  beats: DemoBeat[];
}

export const demoChapters: DemoChapter[] = [
  {
    id: 1,
    title: '开场Hook',
    subtitle: '认识你的装修伙伴',
    duration: 15,
    beats: [
      {
        id: 'ch1-intro',
        duration: 3,
        spotlight: {
          position: { x: 0, y: 0, width: 0, height: 0 },
          shape: 'rect',
        },
        narration: {
          text: '欢迎来到「我的宝贝房子」！',
          position: 'bottom',
        },
      },
      {
        id: 'ch1-hero',
        duration: 6,
        spotlight: {
          selector: '.hero-title',
          shape: 'rect',
          padding: 20,
        },
        narration: {
          text: '滑动屏幕，见证家的蜕变',
          position: 'top',
        },
      },
      {
        id: 'ch1-nian-intro',
        duration: 6,
        spotlight: {
          position: { x: 0, y: 0, width: 0, height: 0 },
          shape: 'rect',
        },
        narration: {
          text: '年兽陪你一起装修，不孤单~',
          position: 'bottom',
        },
        action: {
          type: 'navigate',
          payload: 'onboarding',
        },
      },
    ],
  },
  {
    id: 2,
    title: '风格探测',
    subtitle: '找到你的理想风格',
    duration: 28,
    beats: [
      {
        id: 'ch2-quiz-start',
        duration: 5,
        spotlight: {
          selector: '.chat-container',
          shape: 'rect',
          padding: 15,
        },
        narration: {
          text: '对话式探测，轻松了解喜好',
          position: 'top',
        },
      },
      {
        id: 'ch2-quiz-q1',
        duration: 6,
        spotlight: {
          selector: '.quiz-options',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '5道题，测出你的专属风格',
          position: 'bottom',
        },
      },
      {
        id: 'ch2-quiz-q3',
        duration: 5,
        spotlight: {
          selector: '.quiz-options',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '从色彩到材质，全方位探测',
          position: 'bottom',
        },
      },
      {
        id: 'ch2-result',
        duration: 8,
        spotlight: {
          selector: '.style-result',
          shape: 'rect',
          padding: 15,
        },
        narration: {
          text: '现代中式风格，92%匹配！',
          position: 'top',
        },
      },
      {
        id: 'ch2-continue',
        duration: 4,
        spotlight: {
          selector: '.style-confirm-btn',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '确认风格，开启装修之旅',
          position: 'bottom',
        },
        action: {
          type: 'navigate',
          payload: 'sop',
        },
      },
    ],
  },
  {
    id: 3,
    title: 'SOP + AI功能',
    subtitle: '智能装修全流程',
    duration: 37,
    beats: [
      {
        id: 'ch3-sop-timeline',
        duration: 5,
        spotlight: {
          selector: '.sop-timeline',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '20步SOP，装修不迷路',
          position: 'right',
        },
      },
      {
        id: 'ch3-step-detail',
        duration: 6,
        spotlight: {
          selector: '.step-detail',
          shape: 'rect',
          padding: 15,
        },
        narration: {
          text: '每一步都有详细指引',
          position: 'left',
        },
      },
      {
        id: 'ch3-ai-contract',
        duration: 8,
        spotlight: {
          selector: '.ai-feature-card',
          shape: 'rect',
          padding: 15,
        },
        narration: {
          text: 'AI合同鉴别，避免装修陷阱',
          position: 'top',
        },
      },
      {
        id: 'ch3-ai-quality',
        duration: 8,
        spotlight: {
          selector: '.ai-feature-card',
          shape: 'rect',
          padding: 15,
        },
        narration: {
          text: 'AI质检，每道工序都放心',
          position: 'top',
        },
      },
      {
        id: 'ch3-checklist',
        duration: 5,
        spotlight: {
          selector: '.checklist-card',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '检查清单，逐项验收',
          position: 'bottom',
        },
      },
      {
        id: 'ch3-continue',
        duration: 5,
        spotlight: {
          selector: '.complete-btn',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '完成一步，获得灵气奖励',
          position: 'bottom',
        },
        action: {
          type: 'navigate',
          payload: 'budget',
        },
      },
    ],
  },
  {
    id: 4,
    title: '预算管理',
    subtitle: '花钱明明白白',
    duration: 25,
    beats: [
      {
        id: 'ch4-coin-ring',
        duration: 6,
        spotlight: {
          selector: '.coin-progress-ring',
          shape: 'circle',
          padding: 20,
        },
        narration: {
          text: '铜钱进度环，预算一目了然',
          position: 'right',
        },
      },
      {
        id: 'ch4-532-principle',
        duration: 5,
        spotlight: {
          selector: '.budget-breakdown',
          shape: 'rect',
          padding: 15,
        },
        narration: {
          text: '532原则，科学分配预算',
          position: 'left',
        },
      },
      {
        id: 'ch4-stage-release',
        duration: 6,
        spotlight: {
          selector: '.stage-budget',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '阶段释放，与进度联动',
          position: 'top',
        },
      },
      {
        id: 'ch4-material-list',
        duration: 5,
        spotlight: {
          selector: '.material-list',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '主材清单，逐项追踪采购',
          position: 'bottom',
        },
      },
      {
        id: 'ch4-continue',
        duration: 3,
        spotlight: {
          position: { x: 0, y: 0, width: 0, height: 0 },
          shape: 'rect',
        },
        narration: {
          text: '预算健康，装修无忧',
          position: 'bottom',
        },
        action: {
          type: 'navigate',
          payload: 'nian',
        },
      },
    ],
  },
  {
    id: 5,
    title: '年兽养成 + CTA',
    subtitle: '和年兽一起成长',
    duration: 15,
    beats: [
      {
        id: 'ch5-house-evolution',
        duration: 4,
        spotlight: {
          selector: '.house-scene',
          shape: 'rect',
          padding: 15,
        },
        narration: {
          text: '房子随进度进化，越装越美',
          position: 'top',
        },
      },
      {
        id: 'ch5-nian-interact',
        duration: 4,
        spotlight: {
          selector: '.nian-avatar',
          shape: 'circle',
          padding: 20,
        },
        narration: {
          text: '点击年兽，收集灵气值',
          position: 'right',
        },
      },
      {
        id: 'ch5-stats',
        duration: 3,
        spotlight: {
          selector: '.stats-panel',
          shape: 'rect',
          padding: 10,
        },
        narration: {
          text: '等级装备，养成乐趣满满',
          position: 'left',
        },
      },
      {
        id: 'ch5-cta',
        duration: 4,
        spotlight: {
          position: { x: 0, y: 0, width: 0, height: 0 },
          shape: 'rect',
        },
        narration: {
          text: '现在开始，打造你的梦想家！',
          position: 'bottom',
        },
      },
    ],
  },
];

export const totalDemoDuration = demoChapters.reduce((sum, ch) => sum + ch.duration, 0);
