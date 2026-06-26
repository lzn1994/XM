import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppState } from '../hooks/useAppState';
import NianAvatar from '../components/NianAvatar';
import Button from '../components/Button';
import { styleQuizQuestions, calculateStyleResult } from '../data/style-quiz';
import type { StyleResult, FloorPlanData } from '../types';

type ChatPhase =
  | 'welcome'
  | 'quiz_q1'
  | 'quiz_q2'
  | 'quiz_q3'
  | 'quiz_q4'
  | 'quiz_q5'
  | 'style_result'
  | 'info_budget'
  | 'info_city'
  | 'info_area'
  | 'info_needs'
  | 'floor_plan'
  | 'complete';

interface Message {
  id: number;
  sender: 'nian' | 'user';
  content: React.ReactNode;
  type: 'text' | 'options';
  phase?: ChatPhase;
}

const budgetOptions = [
  { id: 'below-10', label: '10万以下', value: 80000 },
  { id: '10-20', label: '10-20万', value: 150000 },
  { id: '20-30', label: '20-30万', value: 250000 },
  { id: 'above-30', label: '30万以上', value: 400000 },
];

const cityGroups = [
  {
    title: '一线城市',
    cities: ['北京', '上海', '广州', '深圳'],
  },
  {
    title: '新一线城市',
    cities: ['杭州', '成都', '武汉', '西安', '重庆', '南京', '苏州', '天津'],
  },
  {
    title: '二三线城市',
    cities: ['长沙', '郑州', '青岛', '大连', '厦门', '济南', '福州', '合肥'],
  },
];

const areaQuickOptions = [80, 90, 100, 120, 140, 160];

const specialNeedsOptions = [
  { id: 'kids', label: '儿童房', icon: '👶' },
  { id: 'elderly', label: '老人房', icon: '👴' },
  { id: 'pet', label: '宠物', icon: '🐱' },
  { id: 'work', label: '居家办公', icon: '💻' },
  { id: 'smart', label: '智能家居', icon: '🏠' },
];

const q1Emojis: Record<string, string> = {
  'q1-a': '🏮',
  'q1-b': '🌿',
  'q1-c': '🔧',
  'q1-d': '💎',
};

const q5Emojis: Record<string, string> = {
  'q5-a': '🎋',
  'q5-b': '🌲',
};

const feedbackMessages = [
  '感觉你是个喜欢安静有质感空间的人呢~',
  '我好像有点懂你的品味了！',
  '快做完了，让我来揭晓答案~',
];

const OnboardingView: React.FC = () => {
  const { dispatch, setView } = useAppState();
  const [phase, setPhase] = useState<ChatPhase>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [areaInput, setAreaInput] = useState<string>('');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [styleResult, setStyleResult] = useState<StyleResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionComplete, setRecognitionComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const initializedRef = useRef(false);
  const styleResultMsgAddedRef = useRef(false);
  const floorPlanMsgAddedRef = useRef(false);
  const completeMsgAddedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    addNianTextMessage('你好呀！我是年兽🐲，欢迎来到「我的宝贝房子」！');
    setTimeout(() => {
      addNianTextMessage('装修是件大事，不过别担心，我会陪着你一步步完成的~');
    }, 800);
    setTimeout(() => {
      addNianTextMessage('在开始之前，让我先了解一下你喜欢什么样的风格吧！准备好了吗？');
    }, 1600);
    setTimeout(() => {
      setPhase('quiz_q1');
    }, 2400);
  }, []);

  const addMessage = (message: Omit<Message, 'id'>) => {
    messageIdRef.current += 1;
    setMessages((prev) => [...prev, { ...message, id: messageIdRef.current }]);
  };

  const addNianTextMessage = (text: string) => {
    addMessage({ sender: 'nian', content: text, type: 'text' });
  };

  const addUserTextMessage = (text: string) => {
    addMessage({ sender: 'user', content: text, type: 'text' });
  };

  const addOptionsMessage = (content: React.ReactNode, phase: ChatPhase) => {
    addMessage({ sender: 'nian', content, type: 'options', phase });
  };

  const handleQuizAnswer = (questionId: number, optionId: string, optionLabel: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    addUserTextMessage(optionLabel);

    const questionIndex = questionId;

    if (questionIndex === 2) {
      setTimeout(() => {
        addNianTextMessage(feedbackMessages[0]);
      }, 500);
    } else if (questionIndex === 4) {
      setTimeout(() => {
        addNianTextMessage(feedbackMessages[1]);
      }, 500);
    }

    setTimeout(() => {
      if (questionId < 5) {
        setPhase((`quiz_q${questionId + 1}`) as ChatPhase);
      } else {
        const newAnswers = { ...answers, [questionId]: optionId };
        const result = calculateStyleResult(newAnswers);
        setStyleResult(result);
        setPhase('style_result');
      }
    }, questionIndex === 2 || questionIndex === 4 ? 1500 : 800);
  };

  useEffect(() => {
    if (phase === 'style_result' && styleResult && !styleResultMsgAddedRef.current) {
      styleResultMsgAddedRef.current = true;
      setTimeout(() => {
        addNianTextMessage('好啦！测试完成~让我来揭晓你的专属风格！');
      }, 300);
    }
  }, [phase, styleResult]);

  const handleStyleConfirm = () => {
    setPhase('info_budget');
  };

  const handleBudgetSelect = (budgetId: string, budgetLabel: string, budgetValue: number) => {
    setSelectedBudget(budgetId);
    addUserTextMessage(budgetLabel);
    dispatch({ type: 'UPDATE_USER_SESSION', payload: { budgetTotal: budgetValue } });
    setTimeout(() => {
      setPhase('info_city');
    }, 600);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    addUserTextMessage(city);
    dispatch({ type: 'UPDATE_USER_SESSION', payload: { city } });
    setTimeout(() => {
      setPhase('info_area');
    }, 600);
  };

  const handleAreaSelect = (area: number) => {
    setAreaInput(String(area));
    addUserTextMessage(`${area}㎡`);
    dispatch({ type: 'UPDATE_USER_SESSION', payload: { area } });
    setTimeout(() => {
      setPhase('info_needs');
    }, 600);
  };

  const handleAreaInputConfirm = () => {
    const area = parseInt(areaInput, 10);
    if (area > 0) {
      addUserTextMessage(`${area}㎡`);
      dispatch({ type: 'UPDATE_USER_SESSION', payload: { area } });
      setTimeout(() => {
        setPhase('info_needs');
      }, 600);
    }
  };

  const toggleNeed = (needId: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(needId) ? prev.filter((n) => n !== needId) : [...prev, needId]
    );
  };

  const handleNeedsConfirm = () => {
    const needLabels = selectedNeeds.map(
      (id) => specialNeedsOptions.find((o) => o.id === id)?.label || ''
    );
    addUserTextMessage(needLabels.length > 0 ? needLabels.join('、') : '暂无特殊需求');
    dispatch({ type: 'UPDATE_USER_SESSION', payload: { specialNeeds: needLabels } });
    setTimeout(() => {
      setPhase('floor_plan');
    }, 600);
  };

  const startFloorPlanRecognition = useCallback(() => {
    setIsRecognizing(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setRecognitionComplete(true);
            const floorPlan: FloorPlanData = {
              rooms: 3,
              area: 100,
              layout: '朝南户型',
            };
            dispatch({ type: 'UPDATE_USER_SESSION', payload: { floorPlan } });
            addNianTextMessage('识别完成！看起来是个不错的户型呢~');
            setTimeout(() => {
              setPhase('complete');
            }, 1500);
          }, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  }, [dispatch]);

  useEffect(() => {
    if (phase === 'floor_plan' && !isRecognizing && !recognitionComplete && !floorPlanMsgAddedRef.current) {
      floorPlanMsgAddedRef.current = true;
      const timer1 = setTimeout(() => {
        addNianTextMessage('最后一步！让我帮你识别一下户型图吧~');
      }, 300);
      const timer2 = setTimeout(() => {
        startFloorPlanRecognition();
      }, 1200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [phase, isRecognizing, recognitionComplete, startFloorPlanRecognition]);

  useEffect(() => {
    if (phase === 'complete' && styleResult && !completeMsgAddedRef.current) {
      completeMsgAddedRef.current = true;
      dispatch({ type: 'UPDATE_USER_SESSION', payload: { styleResult } });
      dispatch({
        type: 'UPDATE_SOP_PROGRESS',
        payload: { currentStep: 0, completedSteps: [0] },
      });
      setTimeout(() => {
        addNianTextMessage('太好了！所有信息都收集完毕啦~');
      }, 300);
      setTimeout(() => {
        addNianTextMessage('现在让我们正式开始装修之旅吧！跟我来~');
      }, 1200);
    }
  }, [phase, styleResult, dispatch]);

  const handleEnterSOP = () => {
    setView('sop');
  };

  const renderQuizOptions = (questionId: number) => {
    const question = styleQuizQuestions.find((q) => q.id === questionId);
    if (!question) return null;

    if (questionId === 1) {
      return (
        <div className="quiz-options grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleQuizAnswer(questionId, option.id, option.label)}
              className="flex flex-col items-center p-4 bg-[var(--color-surface)] rounded-lg border-2 border-transparent hover:border-[var(--color-primary)] transition-all duration-200"
            >
              <div className="text-4xl mb-2">{q1Emojis[option.id] || '🏠'}</div>
              <span className="text-sm text-center text-[var(--color-text)]">{option.label}</span>
            </button>
          ))}
        </div>
      );
    }

    if (questionId === 5) {
      return (
        <div className="quiz-options grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleQuizAnswer(questionId, option.id, option.label)}
              className="flex flex-col items-center p-6 bg-[var(--color-surface)] rounded-lg border-2 border-transparent hover:border-[var(--color-primary)] transition-all duration-200"
            >
              <div className="text-5xl mb-3">{q5Emojis[option.id] || '🏠'}</div>
              <span className="text-sm text-center text-[var(--color-text)] font-medium">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="quiz-options flex flex-col gap-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleQuizAnswer(questionId, option.id, option.label)}
            className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-lg border-2 border-transparent hover:border-[var(--color-primary)] transition-all duration-200 text-left"
          >
            <div className="w-5 h-5 rounded-full border-2 border-[var(--color-text-secondary)] flex-shrink-0" />
            <span className="text-[var(--color-text)]">{option.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderStyleResult = () => {
    if (!styleResult) return null;

    return (
      <div className="style-result bg-[var(--color-surface)] rounded-xl p-5 shadow-md">
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-[var(--color-text)] mb-1">
            你的专属风格
          </div>
          <div className="text-2xl font-bold text-[var(--color-primary)] mb-2">
            {styleResult.styleName}
          </div>
          <div className="text-3xl font-bold text-[var(--color-secondary)]">
            {styleResult.matchScore}% 匹配
          </div>
        </div>
        <div className="text-center text-[var(--color-text-secondary)] mb-4 italic">
          「{styleResult.tagline}」
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {styleResult.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-[var(--color-primary)] text-white text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-5">
          {styleResult.description}
        </p>
        <Button variant="primary" className="style-confirm-btn w-full" onClick={handleStyleConfirm}>
          确认，继续
        </Button>
      </div>
    );
  };

  const renderBudgetOptions = () => (
    <div className="space-y-3">
      <div className="text-[var(--color-text)] font-medium mb-2">你的装修预算是多少？</div>
      <div className="grid grid-cols-2 gap-2">
        {budgetOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleBudgetSelect(option.id, option.label, option.value)}
            className={`px-4 py-3 rounded-full border-2 transition-all duration-200 text-sm font-medium ${
              selectedBudget === option.id
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                : 'border-[var(--color-text-secondary)]/30 bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCityOptions = () => (
    <div className="space-y-4">
      <div className="text-[var(--color-text)] font-medium">你在哪个城市？</div>
      {cityGroups.map((group) => (
        <div key={group.title}>
          <div className="text-xs text-[var(--color-text-secondary)] mb-2">{group.title}</div>
          <div className="flex flex-wrap gap-2">
            {group.cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                  selectedCity === city
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-text-secondary)]/30 hover:border-[var(--color-primary)]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAreaOptions = () => (
    <div className="space-y-4">
      <div className="text-[var(--color-text)] font-medium">房屋面积是多少？</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={areaInput}
          onChange={(e) => setAreaInput(e.target.value)}
          placeholder="输入面积"
          className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-text-secondary)]/30 bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
        />
        <span className="text-[var(--color-text-secondary)]">㎡</span>
        <Button variant="primary" size="small" onClick={handleAreaInputConfirm}>
          确定
        </Button>
      </div>
      <div className="text-xs text-[var(--color-text-secondary)]">快捷选择：</div>
      <div className="flex flex-wrap gap-2">
        {areaQuickOptions.map((area) => (
          <button
            key={area}
            onClick={() => handleAreaSelect(area)}
            className="px-3 py-1.5 rounded-full text-sm bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-text-secondary)]/30 hover:border-[var(--color-primary)] transition-all duration-200"
          >
            {area}㎡
          </button>
        ))}
      </div>
    </div>
  );

  const renderNeedsOptions = () => (
    <div className="space-y-4">
      <div className="text-[var(--color-text)] font-medium">有什么特殊需求吗？（可多选）</div>
      <div className="flex flex-wrap gap-2">
        {specialNeedsOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleNeed(option.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 flex items-center gap-2 ${
              selectedNeeds.includes(option.id)
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-text-secondary)]/30 hover:border-[var(--color-primary)]'
            }`}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      <Button variant="primary" className="w-full mt-4" onClick={handleNeedsConfirm}>
        下一步
      </Button>
    </div>
  );

  const renderFloorPlanRecognition = () => (
    <div className="space-y-4">
      {!recognitionComplete ? (
        <>
          <div className="text-[var(--color-text)] font-medium text-center mb-4">
            AI户型识别中...
          </div>
          <div className="relative w-32 h-32 mx-auto">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(74,111,165,${0.1 + uploadProgress * 0.006}) 0%, rgba(74,111,165,0) 70%)`,
                transform: `scale(${0.5 + uploadProgress * 0.005})`,
                transition: 'all 0.3s ease-out',
              }}
            />
            <div
              className="absolute inset-4 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(200,74,62,${0.15 + uploadProgress * 0.005}) 0%, rgba(200,74,62,0) 70%)`,
                transform: `scale(${0.6 + uploadProgress * 0.004})`,
                transition: 'all 0.3s ease-out 0.1s',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl">🏠</div>
            </div>
          </div>
          <div className="w-full bg-[var(--color-surface)] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-center text-sm text-[var(--color-text-secondary)]">
            {uploadProgress < 100 ? `正在识别... ${uploadProgress}%` : '识别完成！'}
          </div>
        </>
      ) : (
        <div className="bg-[var(--color-surface)] rounded-xl p-5 shadow-md">
          <div className="text-center font-semibold text-[var(--color-text)] mb-4">
            户型识别结果
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--color-primary)]">3室1厅</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">户型格局</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-primary)]">100㎡</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">建筑面积</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-primary)]">朝南</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">朝向</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOptionsContent = () => {
    switch (phase) {
      case 'quiz_q1':
      case 'quiz_q2':
      case 'quiz_q3':
      case 'quiz_q4':
      case 'quiz_q5': {
        const qNum = parseInt(phase.replace('quiz_q', ''), 10);
        const question = styleQuizQuestions.find((q) => q.id === qNum);
        return (
          <div className="space-y-3">
            {question && (
              <div className="text-[var(--color-text)] font-medium">
                第{qNum}题：{question.title}
              </div>
            )}
            {renderQuizOptions(qNum)}
          </div>
        );
      }
      case 'style_result':
        return renderStyleResult();
      case 'info_budget':
        return renderBudgetOptions();
      case 'info_city':
        return renderCityOptions();
      case 'info_area':
        return renderAreaOptions();
      case 'info_needs':
        return renderNeedsOptions();
      case 'floor_plan':
        return renderFloorPlanRecognition();
      case 'complete':
        return (
          <div className="text-center space-y-4">
            <div className="text-5xl mb-2">🎉</div>
            <div className="text-lg font-semibold text-[var(--color-text)]">
              准备完成！
            </div>
            <Button variant="primary" className="w-full" onClick={handleEnterSOP}>
              开始装修之旅
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const showOptions =
    phase.startsWith('quiz_') ||
    phase === 'style_result' ||
    phase === 'info_budget' ||
    phase === 'info_city' ||
    phase === 'info_area' ||
    phase === 'info_needs' ||
    phase === 'floor_plan' ||
    phase === 'complete';

  const lastPhaseWithOptions = useRef<string | null>(null);

  useEffect(() => {
    if (showOptions && lastPhaseWithOptions.current !== phase) {
      lastPhaseWithOptions.current = phase;
      addOptionsMessage(renderOptionsContent(), phase);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, showOptions]);

  return (
    <div className="chat-container flex-1 flex flex-col bg-mi-white min-h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 lg:py-8">
        <div className="max-w-2xl mx-auto space-y-4 lg:bg-nuan-white lg:rounded-2xl lg:shadow-card lg:p-6 lg:border lg:border-fu-gray/10">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{
                animation: 'messageAppear 0.3s ease-out',
              }}
            >
              {message.sender === 'nian' && (
                <div className="mr-3 flex-shrink-0">
                  <NianAvatar size={40} />
                </div>
              )}
              <div
                className={`max-w-[75%] ${
                  message.sender === 'user' ? 'order-first mr-3' : ''
                }`}
              >
                {message.type === 'text' && (
                  <div
                    className={`px-4 py-3 rounded-xl ${
                      message.sender === 'user'
                        ? 'bg-[var(--color-text-secondary)]/20 text-[var(--color-text)] text-right'
                        : 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
                    }`}
                    style={{
                      borderRadius:
                        message.sender === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    }}
                  >
                    {message.content}
                  </div>
                )}
                {message.type === 'options' && (
                  <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-sm">
                    {message.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <style>{`
        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingView;
