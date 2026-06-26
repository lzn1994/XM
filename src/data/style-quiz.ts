import type { QuizQuestion, StyleWeight, StyleResult, StyleType } from '../types';

export const styleQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: '请选择你最喜欢的客厅视觉风格',
    type: 'image-single',
    options: [
      {
        id: 'q1-a',
        label: '留白墙面 + 胡桃木家具',
        weights: {
          'modern-chinese': 30,
          nordic: 10,
          japanese: 20,
          luxury: 15,
          industrial: 5,
        },
      },
      {
        id: 'q1-b',
        label: '温暖原木 + 布艺沙发',
        weights: {
          'modern-chinese': 10,
          nordic: 30,
          japanese: 25,
          luxury: 5,
          industrial: 5,
        },
      },
      {
        id: 'q1-c',
        label: '裸露管线 + 冷灰调',
        weights: {
          'modern-chinese': 5,
          nordic: 5,
          japanese: 5,
          luxury: 10,
          industrial: 35,
        },
      },
      {
        id: 'q1-d',
        label: '繁花壁纸 + 水晶吊灯',
        weights: {
          'modern-chinese': 10,
          nordic: 5,
          japanese: 5,
          luxury: 35,
          industrial: 5,
        },
      },
    ],
  },
  {
    id: 2,
    title: '你更偏好哪种色系？',
    type: 'single',
    options: [
      {
        id: 'q2-a',
        label: '米白浅灰原木色',
        weights: {
          'modern-chinese': 15,
          nordic: 25,
          japanese: 30,
          luxury: 10,
          industrial: 10,
        },
      },
      {
        id: 'q2-b',
        label: '深蓝墨绿暖棕',
        weights: {
          'modern-chinese': 25,
          nordic: 10,
          japanese: 10,
          luxury: 25,
          industrial: 15,
        },
      },
      {
        id: 'q2-c',
        label: '明亮撞色活力橙黄',
        weights: {
          'modern-chinese': 5,
          nordic: 15,
          japanese: 5,
          luxury: 20,
          industrial: 25,
        },
      },
    ],
  },
  {
    id: 3,
    title: '你的理想生活方式是？',
    type: 'single',
    options: [
      {
        id: 'q3-a',
        label: '阳台泡茶看晨光',
        weights: {
          'modern-chinese': 30,
          nordic: 15,
          japanese: 25,
          luxury: 10,
          industrial: 5,
        },
      },
      {
        id: 'q3-b',
        label: '开放式厨房做早午餐',
        weights: {
          'modern-chinese': 10,
          nordic: 30,
          japanese: 15,
          luxury: 20,
          industrial: 10,
        },
      },
      {
        id: 'q3-c',
        label: '窝沙发追剧点外卖',
        weights: {
          'modern-chinese': 10,
          nordic: 20,
          japanese: 20,
          luxury: 15,
          industrial: 20,
        },
      },
      {
        id: 'q3-d',
        label: '书房看书需要独处',
        weights: {
          'modern-chinese': 25,
          nordic: 15,
          japanese: 20,
          luxury: 15,
          industrial: 10,
        },
      },
    ],
  },
  {
    id: 4,
    title: '下面这些材质，你更喜欢摸上去的感觉？',
    type: 'single',
    options: [
      {
        id: 'q4-a',
        label: '温润胡桃木',
        weights: {
          'modern-chinese': 30,
          nordic: 20,
          japanese: 25,
          luxury: 15,
          industrial: 5,
        },
      },
      {
        id: 'q4-b',
        label: '粗糙微水泥',
        weights: {
          'modern-chinese': 20,
          nordic: 10,
          japanese: 15,
          luxury: 15,
          industrial: 30,
        },
      },
      {
        id: 'q4-c',
        label: '柔软亚麻布',
        weights: {
          'modern-chinese': 10,
          nordic: 25,
          japanese: 30,
          luxury: 10,
          industrial: 5,
        },
      },
      {
        id: 'q4-d',
        label: '冰凉大理石',
        weights: {
          'modern-chinese': 15,
          nordic: 10,
          japanese: 5,
          luxury: 40,
          industrial: 15,
        },
      },
    ],
  },
  {
    id: 5,
    title: '最后二选一，你更中意？',
    type: 'image-single',
    options: [
      {
        id: 'q5-a',
        label: '现代中式（格栅 + 微水泥）',
        weights: {
          'modern-chinese': 40,
          nordic: 5,
          japanese: 15,
          luxury: 20,
          industrial: 10,
        },
      },
      {
        id: 'q5-b',
        label: '北欧简约（白墙 + 原木）',
        weights: {
          'modern-chinese': 5,
          nordic: 40,
          japanese: 25,
          luxury: 10,
          industrial: 10,
        },
      },
    ],
  },
];

const styleInfo: Record<StyleType, { name: string; tagline: string; tags: string[]; description: string }> = {
  'modern-chinese': {
    name: '现代中式',
    tagline: '追求静气与秩序的东方生活家',
    tags: ['留白', '胡桃木', '格栅', '微水泥'],
    description: '融合传统中式美学与现代生活方式，以留白意境、温润胡桃木、格栅隔断、微水泥质感打造宁静雅致的东方居所。',
  },
  nordic: {
    name: '北欧简约',
    tagline: '简约不简单，自然本真',
    tags: ['原木', '白墙', '简约', '自然'],
    description: '以白色为基调，搭配原木家具和绿植，强调功能性与舒适度的平衡，营造温馨明亮的生活空间。',
  },
  japanese: {
    name: '日式和风',
    tagline: '侘寂之美，质朴宁静',
    tags: ['榻榻米', '原木', '禅意', '收纳'],
    description: '追求自然材质与简约线条，注重空间的通透感和收纳功能，体现日式美学中的侘寂哲学。',
  },
  luxury: {
    name: '轻奢风格',
    tagline: '精致生活，低调奢华',
    tags: ['金属', '大理石', '质感', '精致'],
    description: '以高品质材质和精致细节为特征，金属、大理石、丝绒等元素的巧妙运用，彰显品质与品味。',
  },
  industrial: {
    name: '工业风格',
    tagline: '原始粗犷，个性十足',
    tags: ['裸露管线', '水泥', '金属', '复古'],
    description: '保留建筑原始结构，裸露的管线、水泥墙面、金属家具，打造充满个性和艺术气息的工业风空间。',
  },
};

export function calculateStyleResult(answers: Record<number, string>): StyleResult {
  const totalWeights: StyleWeight = {
    'modern-chinese': 0,
    nordic: 0,
    japanese: 0,
    luxury: 0,
    industrial: 0,
  };

  for (const question of styleQuizQuestions) {
    const answerId = answers[question.id];
    if (answerId) {
      const option = question.options.find((opt) => opt.id === answerId);
      if (option) {
        (Object.keys(option.weights) as StyleType[]).forEach((style) => {
          totalWeights[style] += option.weights[style];
        });
      }
    }
  }

  const totalScore = Object.values(totalWeights).reduce((sum, val) => sum + val, 0);

  let topStyle: StyleType = 'modern-chinese';
  let topScore = 0;

  (Object.keys(totalWeights) as StyleType[]).forEach((style) => {
    if (totalWeights[style] > topScore) {
      topScore = totalWeights[style];
      topStyle = style;
    }
  });

  const matchScore = totalScore > 0 ? Math.round((topScore / totalScore) * 100) : 87;

  const info = styleInfo[topStyle];

  return {
    styleName: info.name,
    matchScore,
    tagline: info.tagline,
    tags: info.tags,
    description: info.description,
  };
}

export const defaultStyleResult: StyleResult = {
  styleName: '现代中式',
  matchScore: 87,
  tagline: '追求静气与秩序的东方生活家',
  tags: ['留白', '胡桃木', '格栅', '微水泥'],
  description: '融合传统中式美学与现代生活方式，以留白意境、温润胡桃木、格栅隔断、微水泥质感打造宁静雅致的东方居所。',
};
