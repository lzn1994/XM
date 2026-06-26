import React, { useState, useRef, useCallback } from 'react';
import { useAppState } from '../hooks/useAppState';
import Button from '../components/Button';
import Card from '../components/Card';
import NianAvatar from '../components/NianAvatar';
import FloorPlanRecognition from '../components/ai/FloorPlanRecognition';
import ContractReview from '../components/ai/ContractReview';
import QualityInspection from '../components/ai/QualityInspection';
import { ParticleBurst, SuccessState } from '../components/animations';
import { sopStages, sopSteps, getStepStatus } from '../data/sop-steps';
import type { SopStep } from '../types';

const SOPView: React.FC = () => {
  const { state, dispatch, setView } = useAppState();
  const { sopProgress, nianProgress } = state;
  const [selectedStep, setSelectedStep] = useState<number>(sopProgress.currentStep);
  const [showNianGuide, setShowNianGuide] = useState(true);
  const [aiCompleted, setAiCompleted] = useState<Record<number, boolean>>({});
  const [activeAIModal, setActiveAIModal] = useState<number | null>(null);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ title: '', reward: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const currentStepData = sopSteps.find((s) => s.id === selectedStep) || sopSteps[0];

  const getStepState = (stepId: number): 'completed' | 'current' | 'locked' => {
    return getStepStatus(stepId, sopProgress.currentStep);
  };

  const handleStepClick = (stepId: number) => {
    const stepState = getStepState(stepId);
    if (stepState !== 'locked') {
      setSelectedStep(stepId);
      setShowNianGuide(true);
    }
  };

  const handleCompleteStep = useCallback(() => {
    const step = currentStepData;
    if (step.aiTrigger === 'forced' && !aiCompleted[step.id]) {
      return;
    }

    const newCompletedSteps = [...sopProgress.completedSteps, step.id];
    const nextStep = step.id + 1;
    const nextStepData = sopSteps.find((s) => s.id === nextStep);

    let newStageUnlockStatus = [...sopProgress.stageUnlockStatus];
    if (nextStepData && !newStageUnlockStatus[nextStepData.stageIndex]) {
      newStageUnlockStatus[nextStepData.stageIndex] = true;
    }

    const spiritGain = 100;
    const newSpirit = nianProgress.spiritPoints + spiritGain;
    const spiritPerLevel = 500;
    const newLevel = Math.floor(newSpirit / spiritPerLevel) + 1;
    const newHouseScore = sopProgress.completedSteps.length * 10 + 10;

    dispatch({
      type: 'UPDATE_SOP_PROGRESS',
      payload: {
        currentStep: Math.min(nextStep, 20),
        completedSteps: newCompletedSteps,
        stageUnlockStatus: newStageUnlockStatus,
      },
    });

    dispatch({
      type: 'UPDATE_NIAN_PROGRESS',
      payload: {
        level: newLevel,
        spiritPoints: newSpirit,
        houseScore: newHouseScore,
      },
    });

    setBurstTrigger((prev) => prev + 1);
    setSuccessData({ title: step.title, reward: spiritGain });
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);

    if (nextStep <= 20) {
      setTimeout(() => {
        setSelectedStep(nextStep);
        setShowNianGuide(true);
      }, 500);
    }
  }, [currentStepData, aiCompleted, sopProgress, nianProgress, dispatch]);

  const handleAiDetect = (stepId: number) => {
    setActiveAIModal(stepId);
  };

  const handleAIComplete = (stepId: number) => {
    setAiCompleted((prev) => ({ ...prev, [stepId]: true }));
    setActiveAIModal(null);
  };

  const handleAIClose = () => {
    setActiveAIModal(null);
  };

  const renderAIModal = () => {
    if (activeAIModal === null) return null;

    switch (activeAIModal) {
      case 1:
        return (
          <FloorPlanRecognition
            onComplete={() => handleAIComplete(1)}
            onClose={handleAIClose}
          />
        );
      case 3:
        return (
          <ContractReview
            onComplete={() => handleAIComplete(3)}
          />
        );
      case 10:
      case 12:
      case 13:
      case 15:
        return (
          <QualityInspection
            stepId={activeAIModal}
            onComplete={(passed) => {
              if (passed) {
                handleAIComplete(activeAIModal);
              } else {
                setActiveAIModal(null);
              }
            }}
            onClose={handleAIClose}
          />
        );
      default:
        return null;
    }
  };

  const getStepsByStage = (stageIndex: number) => {
    return sopSteps.filter((s) => s.stageIndex === stageIndex);
  };

  const renderTimelineItem = (step: SopStep) => {
    const stepState = getStepState(step.id);
    const isSelected = selectedStep === step.id;

    const dotStyles = {
      completed: 'bg-zhu-green border-zhu-green',
      current: 'bg-zhu-red border-zhu-red pulse-dot',
      locked: 'bg-transparent border-fu-gray border-2',
    };

    const lineStyles = {
      completed: 'bg-gradient-to-b from-zhu-green to-zhu-green/50',
      current: 'bg-gradient-to-b from-zhu-red/50 to-fu-gray/30',
      locked: 'bg-fu-gray/20',
    };

    const textStyles = {
      completed: 'text-mo-black',
      current: 'text-dai-blue font-semibold',
      locked: 'text-fu-gray',
    };

    const isLocked = stepState === 'locked';
    const isCurrent = stepState === 'current';

    return (
      <div
        key={step.id}
        className={`relative pl-10 pb-5 cursor-pointer transition-all duration-300 ${
          isLocked ? 'cursor-not-allowed opacity-60' : 'hover:bg-mi-white/50 hover:rounded-lg'
        } ${isSelected ? 'bg-mi-white rounded-lg shadow-sm' : ''}`}
        onClick={() => handleStepClick(step.id)}
      >
        <div
          className={`absolute left-3 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${dotStyles[stepState]}`}
        >
          {stepState === 'completed' && (
            <span className="text-white text-[10px] font-bold">✓</span>
          )}
          {stepState === 'locked' && (
            <span className="text-[8px]">🔒</span>
          )}
        </div>

        {isCurrent && (
          <div className="absolute left-3 top-1 w-5 h-5 rounded-full bg-zhu-red/30 -z-0 pulse-ring" />
        )}

        <div className="flex items-start gap-2">
          <span className={`text-sm ${textStyles[stepState]} flex-shrink-0 font-medium`}>
            {step.id}.
          </span>
          <span className={`text-sm ${textStyles[stepState]} leading-relaxed`}>
            {step.title}
          </span>
        </div>

        {step.id < 20 && (
          <div
            className={`absolute left-[22px] top-7 w-0.5 h-7 ${lineStyles[stepState]}`}
            style={{
              background: stepState === 'completed' 
                ? 'linear-gradient(to bottom, #5B8C5A, rgba(91, 140, 90, 0.3))'
                : stepState === 'current'
                ? 'linear-gradient(to bottom, rgba(184, 58, 45, 0.5), rgba(107, 107, 107, 0.2))'
                : 'rgba(107, 107, 107, 0.15)',
            }}
          />
        )}

        {isCurrent && burstTrigger > 0 && (
          <div className="absolute left-3 top-1 w-5 h-5">
            <ParticleBurst
              trigger={burstTrigger}
              x={50}
              y={50}
              particleCount={12}
              color="rgba(184, 58, 45, 0.6)"
            />
          </div>
        )}
      </div>
    );
  };

  const renderStepDetail = () => {
    const step = currentStepData;
    const stepState = getStepState(step.id);
    const isCurrentStep = stepState === 'current';
    const isCompleted = stepState === 'completed';
    const isLocked = stepState === 'locked';

    return (
      <div ref={detailRef} className="step-detail flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-dai-blue text-title font-bold font-kai">
                第 {step.id} 步
              </span>
              <span className="px-3 py-1 bg-dai-blue/10 text-dai-blue rounded-tag text-helper font-medium font-kai">
                {step.stage}
              </span>
            </div>
            <Button variant="text" onClick={() => setView('onboarding')}>
              返回首页
            </Button>
          </div>

          <h2 className="text-2xl font-bold text-mo-black mb-6 font-kai flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-dai-blue to-zhu-green rounded-full" />
            {step.title}
          </h2>

          {showNianGuide && !isLocked && (
            <div className="flex items-start gap-4 mb-6 animate-fade-in">
              <NianAvatar size={48} />
              <div className="flex-1">
                <div className="bg-nuan-white p-4 rounded-card shadow-card relative">
                  <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-nuan-white" />
                  <p className="text-body text-mo-black">
                    接下来我们要做「{step.title}」，准备好了吗？
                  </p>
                </div>
                <div className="mt-2">
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setShowNianGuide(false)}
                  >
                    知道了
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showSuccess && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 pointer-events-none">
              <div className="pointer-events-auto">
                <SuccessState
                  title="步骤完成！"
                  description={`「${successData.title}」已完成`}
                  rewardText={`灵气 +${successData.reward}`}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Card title="做什么">
              <p className="text-body text-mo-black leading-relaxed">
                {step.description}
              </p>
            </Card>

            <Card title="怎么做">
              <p className="text-body text-mo-black leading-relaxed">
                按照下方检查清单逐项完成，确保每一步都做到位。有疑问可以随时找年兽咨询。
              </p>
            </Card>

            <Card title="检查清单">
              <div className="checklist-card space-y-2">
                {step.checklist.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-mi-white transition-colors"
                  >
                    <span className="text-zhu-green text-lg">✅</span>
                    <span className="text-body text-mo-black">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {step.materialReminder && (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📦</span>
                  <span className="font-semibold text-orange-800">主材采购提醒</span>
                </div>
                <p className="text-body text-orange-700">{step.materialReminder}</p>
              </div>
            )}

            {step.styleTip && (
              <div className="bg-[#8B6F47]/10 border-l-4 border-tan-brown p-4 rounded-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💡</span>
                  <span className="font-semibold text-tan-brown">中式风格小贴士</span>
                </div>
                <p className="text-body text-tan-brown">{step.styleTip}</p>
              </div>
            )}

            {step.aiTrigger !== 'none' && (
              <div className="ai-feature-card bg-gradient-to-r from-dai-blue/5 to-zhu-green/5 border border-dai-blue/20 p-5 rounded-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dai-blue flex items-center justify-center">
                      <span className="text-white text-xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-mo-black">{step.aiType}</h3>
                      <p className="text-helper text-fu-gray">
                        {step.aiTrigger === 'forced' ? '必须完成AI检测才能继续' : 'AI辅助检测，推荐使用'}
                      </p>
                    </div>
                  </div>
                  {aiCompleted[step.id] ? (
                    <span className="px-3 py-1 bg-zhu-green/10 text-zhu-green rounded-tag text-helper font-medium">
                      ✓ 检测完成
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleAiDetect(step.id)}
                    >
                      开始AI检测
                    </Button>
                  )}
                </div>
                {aiCompleted[step.id] && (
                  <div className="mt-3 p-3 bg-zhu-green/10 rounded-lg">
                    <p className="text-body text-zhu-green">
                      ✨ AI检测完成，一切正常！可以继续下一步了。
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 pb-8">
            {isCurrentStep && (
              <Button
                variant="primary"
                size="large"
                className="complete-btn w-full py-3 text-lg"
                onClick={handleCompleteStep}
                disabled={step.aiTrigger === 'forced' && !aiCompleted[step.id]}
              >
                {step.aiTrigger === 'forced' && !aiCompleted[step.id]
                  ? '请先完成AI检测'
                  : '已完成，进入下一步'}
              </Button>
            )}

            {isCompleted && (
              <div className="flex items-center justify-center gap-2 p-4 bg-zhu-green/10 rounded-card">
                <span className="text-2xl">✓</span>
                <span className="text-lg font-semibold text-zhu-green">已完成</span>
              </div>
            )}

            {isLocked && (
              <div className="p-6 bg-fu-gray/10 rounded-card text-center">
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-body text-fu-gray mb-2">此步骤已锁定</p>
                <p className="text-helper text-fu-gray">
                  完成第 {sopProgress.currentStep} 步后解锁此步骤
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex bg-mi-white min-h-full">
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(74, 111, 165, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(74, 111, 165, 0);
          }
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes celebration {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }
        .animate-celebration {
          animation: celebration 2s ease-out;
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
      `}</style>

      <div className="sop-timeline hidden md:block w-72 bg-nuan-white border-r border-ink-light flex-shrink-0 relative">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(58, 90, 140, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(91, 140, 90, 0.02) 0%, transparent 50%)'
        }} />
        <div className="p-4 border-b border-ink-light relative">
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-tan-brown/20 to-transparent" />
          <h2 className="text-title font-bold text-mo-black font-kai flex items-center gap-2">
            <span className="text-tan-brown text-sm">❖</span>
            装修SOP流程
          </h2>
          <p className="text-helper text-fu-gray mt-1">
            已完成 {sopProgress.completedSteps.length} / 20 步
          </p>
          <div className="mt-3 w-full bg-fu-gray/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-zhu-green to-dai-blue h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(sopProgress.completedSteps.length / 20) * 100}%`,
              }}
            />
          </div>
        </div>

        <div ref={timelineRef} className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {sopStages.map((stage) => {
            const stageSteps = getStepsByStage(stage.index);
            const isStageUnlocked = sopProgress.stageUnlockStatus[stage.index];

            return (
              <div key={stage.index} className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-sm font-bold font-kai ${
                    isStageUnlocked ? 'text-dai-blue' : 'text-fu-gray'
                  }`}>
                    {isStageUnlocked ? '❖ ' : '🔒 '}
                    {stage.name}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-tan-brown/30 via-tan-brown/10 to-transparent" />
                </div>
                <div className={isStageUnlocked ? '' : 'opacity-50'}>
                  {stageSteps.map((step) => renderTimelineItem(step))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-nuan-white border-b border-fu-gray/10 p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-module-title font-bold text-mo-black">
            第 {selectedStep} / 20 步
          </h2>
          <span className="text-helper text-fu-gray">
            {currentStepData.stage}
          </span>
        </div>
        <div className="w-full bg-fu-gray/20 rounded-full h-2">
          <div
            className="bg-dai-blue h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(selectedStep / 20) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:pt-0 pt-20">
        <div className="md:hidden flex overflow-x-auto gap-2 px-3 py-2 bg-nuan-white border-b border-fu-gray/10">
          {sopSteps.map((step) => {
            const stepState = getStepState(step.id);
            const isSelected = selectedStep === step.id;
            const isLocked = stepState === 'locked';

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                disabled={isLocked}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-dai-blue text-white'
                    : stepState === 'completed'
                    ? 'bg-zhu-green text-white'
                    : 'bg-fu-gray/20 text-fu-gray'
                } ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {stepState === 'completed' ? '✓' : step.id}
              </button>
            );
          })}
        </div>

        {renderStepDetail()}
      </div>

      {renderAIModal()}
    </div>
  );
};

export default SOPView;
