import React, { useState, useEffect, useMemo } from 'react';
import { useAppState } from '../hooks/useAppState';
import Button from '../components/Button';
import Card from '../components/Card';
import { calculateBudgetBreakdown, getCityTier, mainMaterialCategories } from '../data/budget-data';
import type { BudgetBreakdown, StageBudget } from '../types';

interface MaterialItem {
  id: string;
  name: string;
  budget: number;
  used: number;
  status: 'not-started' | 'in-progress' | 'completed';
  channel: string;
}

const BudgetView: React.FC = () => {
  const { state, setView } = useAppState();
  const { userSession, sopProgress } = state;

  const [activeTab, setActiveTab] = useState<string>('瓷砖');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const budgetBreakdown: BudgetBreakdown = useMemo(() => {
    if (userSession.budgetBreakdown) {
      return userSession.budgetBreakdown;
    }
    const cityTier = getCityTier(userSession.city || '北京');
    const totalBudget = userSession.budgetTotal || 200000;
    return calculateBudgetBreakdown(totalBudget, cityTier);
  }, [userSession.budgetBreakdown, userSession.budgetTotal, userSession.city]);

  const totalUsed = useMemo(() => {
    const releasedStages = budgetBreakdown.stageRelease.filter(
      (s) => s.status === 'released' || s.status === 'spent'
    );
    return releasedStages.reduce((sum, s) => sum + s.amount, 0);
  }, [budgetBreakdown]);

  const usagePercent = useMemo(() => {
    if (budgetBreakdown.total === 0) return 0;
    return Math.min((totalUsed / budgetBreakdown.total) * 100, 100);
  }, [totalUsed, budgetBreakdown.total]);

  const healthStatus = useMemo(() => {
    if (usagePercent < 70) return 'healthy';
    if (usagePercent <= 90) return 'warning';
    return 'danger';
  }, [usagePercent]);

  const healthConfig = {
    healthy: {
      color: '#5B8C5A',
      label: '预算健康',
      nianEmotion: '😄',
      bgClass: 'bg-zhu-green/10',
      textClass: 'text-zhu-green',
    },
    warning: {
      color: '#8B6F47',
      label: '预算预警',
      nianEmotion: '🤔',
      bgClass: 'bg-tan-brown/10',
      textClass: 'text-tan-brown',
    },
    danger: {
      color: '#C84A3E',
      label: '预算危险',
      nianEmotion: '😱',
      bgClass: 'bg-zhu-red/10',
      textClass: 'text-zhu-red',
    },
  };

  const currentHealth = healthConfig[healthStatus];

  const materialItems: Record<string, MaterialItem[]> = useMemo(() => {
    const baseBudget = budgetBreakdown.categories.mainMaterials.amount;
    return {
      瓷砖: [
        { id: 't1', name: '客厅地砖', budget: Math.round(baseBudget * 0.25), used: Math.round(baseBudget * 0.2), status: 'in-progress', channel: '建材市场/线上' },
        { id: 't2', name: '卫生间墙砖', budget: Math.round(baseBudget * 0.12), used: 0, status: 'not-started', channel: '建材市场' },
        { id: 't3', name: '厨房墙砖', budget: Math.round(baseBudget * 0.13), used: Math.round(baseBudget * 0.13), status: 'completed', channel: '品牌专卖店' },
      ],
      地板: [
        { id: 'f1', name: '卧室地板', budget: Math.round(baseBudget * 0.2), used: 0, status: 'not-started', channel: '品牌专卖店' },
        { id: 'f2', name: '书房地板', budget: Math.round(baseBudget * 0.1), used: 0, status: 'not-started', channel: '品牌专卖店' },
      ],
      橱柜: [
        { id: 'c1', name: '地柜+台面', budget: Math.round(baseBudget * 0.3), used: Math.round(baseBudget * 0.15), status: 'in-progress', channel: '定制品牌' },
        { id: 'c2', name: '吊柜', budget: Math.round(baseBudget * 0.15), used: 0, status: 'not-started', channel: '定制品牌' },
      ],
      木门: [
        { id: 'd1', name: '卧室门×3', budget: Math.round(baseBudget * 0.12), used: 0, status: 'not-started', channel: '建材市场' },
        { id: 'd2', name: '卫生间门×2', budget: Math.round(baseBudget * 0.08), used: 0, status: 'not-started', channel: '建材市场' },
      ],
      洁具: [
        { id: 's1', name: '马桶×2', budget: Math.round(baseBudget * 0.1), used: Math.round(baseBudget * 0.1), status: 'completed', channel: '品牌专卖店' },
        { id: 's2', name: '洗手盆×2', budget: Math.round(baseBudget * 0.08), used: 0, status: 'not-started', channel: '品牌专卖店' },
        { id: 's3', name: '花洒×2', budget: Math.round(baseBudget * 0.07), used: 0, status: 'not-started', channel: '品牌专卖店' },
      ],
    };
  }, [budgetBreakdown]);

  const stageBudgets: StageBudget[] = useMemo(() => {
    return budgetBreakdown.stageRelease.map((stage, index) => ({
      ...stage,
      status: sopProgress.stageUnlockStatus[index]
        ? index < sopProgress.stageUnlockStatus.filter(Boolean).length - 1
          ? 'spent' as const
          : 'released' as const
        : 'locked' as const,
    }));
  }, [budgetBreakdown.stageRelease, sopProgress.stageUnlockStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(usagePercent);
    }, 300);
    return () => clearTimeout(timer);
  }, [usagePercent]);

  useEffect(() => {
    if (usagePercent >= 90) {
      setShowWarningModal(true);
    }
  }, [usagePercent]);

  const CoinProgressRing: React.FC = () => {
    const size = 220;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const segments = [
      { ratio: 0.5, color: '#4A6FA5', label: '硬装', amount: budgetBreakdown.categories.hardDecoration.amount },
      { ratio: 0.3, color: '#5B8C5A', label: '主材', amount: budgetBreakdown.categories.mainMaterials.amount },
      { ratio: 0.2, color: '#8B6F47', label: '备用', amount: budgetBreakdown.categories.reserve.amount },
    ];

    const progressColor = healthStatus === 'healthy' ? '#5B8C5A' : healthStatus === 'warning' ? '#8B6F47' : '#C84A3E';

    return (
      <div className="coin-progress-ring relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F5F0E8"
            strokeWidth={strokeWidth}
          />
          {(() => {
            let offset = 0;
            return segments.map((seg, i) => {
              const dashLength = circumference * seg.ratio;
              const gapLength = circumference * 0.01;
              const dashArray = `${dashLength - gapLength} ${circumference - (dashLength - gapLength)}`;
              const element = (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  className="transition-all duration-1000 ease-out"
                  opacity={0.3}
                />
              );
              offset += dashLength;
              return element;
            });
          })()}
          <circle
            cx={center}
            cy={center}
            r={radius - 6}
            fill="none"
            stroke={progressColor}
            strokeWidth={8}
            strokeDasharray={`${circumference * (animatedProgress / 100)} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth - 8}
            fill="#FAF7F2"
            stroke="#E8DFD0"
            strokeWidth={2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl mb-2">{currentHealth.nianEmotion}</div>
          <div className="text-title font-bold text-mo-black">
            {animatedProgress.toFixed(0)}%
          </div>
          <div className="text-helper text-fu-gray mt-1">
            已使用 ¥{totalUsed.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  const getStageStatusStyle = (status: string) => {
    switch (status) {
      case 'spent':
        return { bg: 'bg-zhu-green/10', text: 'text-zhu-green', label: '已完成', icon: '✓' };
      case 'released':
        return { bg: 'bg-dai-blue/10', text: 'text-dai-blue', label: '进行中', icon: '▶' };
      case 'locked':
      default:
        return { bg: 'bg-fu-gray/10', text: 'text-fu-gray', label: '未解锁', icon: '🔒' };
    }
  };

  const getMaterialStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-zhu-green/10', text: 'text-zhu-green', label: '已完成' };
      case 'in-progress':
        return { bg: 'bg-orange-100', text: 'text-orange-600', label: '采购中' };
      case 'not-started':
      default:
        return { bg: 'bg-fu-gray/10', text: 'text-fu-gray', label: '未采购' };
    }
  };

  return (
    <div className="flex-1 bg-mi-white min-h-full">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-in {
          animation: modalIn 0.3s ease-out forwards;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(200, 74, 62, 0.4);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(200, 74, 62, 0);
          }
        }
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-title text-mo-black">预算管理</h1>
          <Button variant="text" onClick={() => setView('onboarding')}>
            返回首页
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="animate-fade-in-up">
              <div className="flex flex-col items-center">
                <h2 className="text-module-title font-semibold text-mo-black mb-4">
                  预算总览
                </h2>
                <CoinProgressRing />
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-helper text-fu-gray">总预算</span>
                    <span className="text-body font-semibold text-mo-black">
                      ¥{budgetBreakdown.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-helper text-fu-gray">已使用</span>
                    <span className="text-body font-semibold text-mo-black">
                      ¥{totalUsed.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-helper text-fu-gray">剩余预算</span>
                    <span className="text-body font-semibold text-zhu-green">
                      ¥{(budgetBreakdown.total - totalUsed).toLocaleString()}
                    </span>
                  </div>
                  {userSession.city && (
                    <div className="flex items-center justify-between pt-2 border-t border-fu-gray/10">
                      <span className="text-helper text-fu-gray">城市系数</span>
                      <span className="text-helper text-tan-brown">
                        {userSession.city} ×{budgetBreakdown.cityMultiplier}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`w-full mt-4 p-3 rounded-card ${currentHealth.bgClass} flex items-center justify-center gap-2`}>
                  <span className="text-xl">{currentHealth.nianEmotion}</span>
                  <span className={`text-body font-semibold ${currentHealth.textClass}`}>
                    {currentHealth.label}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-module-title font-semibold text-mo-black mb-4">
                预算构成（532原则）
              </h3>
              <div className="budget-breakdown space-y-3">
                {[
                  { label: '硬装', color: '#4A6FA5', ratio: 50, amount: budgetBreakdown.categories.hardDecoration.amount },
                  { label: '主材', color: '#5B8C5A', ratio: 30, amount: budgetBreakdown.categories.mainMaterials.amount },
                  { label: '备用金', color: '#8B6F47', ratio: 20, amount: budgetBreakdown.categories.reserve.amount },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-body text-mo-black">{item.label}</span>
                      </div>
                      <span className="text-body font-semibold text-mo-black">
                        ¥{item.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-mi-white rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${item.ratio}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <div className="text-right text-helper text-fu-gray mt-1">
                      {item.ratio}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-module-title font-semibold text-mo-black">
                  阶段预算
                </h2>
                <span className="text-helper text-fu-gray">
                  与SOP进度联动
                </span>
              </div>
              <div className="stage-budget grid grid-cols-1 md:grid-cols-2 gap-4">
                {stageBudgets.map((stage, index) => {
                  const statusStyle = getStageStatusStyle(stage.status);
                  const isLocked = stage.status === 'locked';
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-card border transition-all duration-300 ${
                        isLocked
                          ? 'bg-fu-gray/5 border-fu-gray/10 opacity-60'
                          : 'bg-nuan-white border-fu-gray/10 hover:shadow-hover cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-body font-semibold text-mo-black">
                            {stage.stage}
                          </h3>
                          <p className="text-helper text-fu-gray mt-1">
                            {stage.purpose}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-tag text-helper font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}>
                          <span>{statusStyle.icon}</span>
                          {statusStyle.label}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-title font-bold text-mo-black">
                            ¥{stage.amount.toLocaleString()}
                          </p>
                          <p className="text-helper text-fu-gray mt-1">
                            占总预算 {(stage.releaseRatio * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="w-24">
                          <div className="w-full bg-mi-white rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${
                                stage.status === 'spent'
                                  ? 'bg-zhu-green'
                                  : stage.status === 'released'
                                  ? 'bg-dai-blue'
                                  : 'bg-fu-gray/30'
                              }`}
                              style={{
                                width: stage.status === 'spent' ? '100%' : stage.status === 'released' ? '40%' : '0%',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-module-title font-semibold text-mo-black">
                  主材采购清单
                </h2>
                <span className="text-helper text-fu-gray">
                  主材预算 ¥{budgetBreakdown.categories.mainMaterials.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {mainMaterialCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveTab(cat.name)}
                    className={`px-4 py-2 rounded-tag text-body font-medium transition-all whitespace-nowrap ${
                      activeTab === cat.name
                        ? 'bg-dai-blue text-white'
                        : 'bg-mi-white text-fu-gray hover:bg-dai-blue/10 hover:text-dai-blue'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="material-list space-y-3">
                {materialItems[activeTab]?.map((item) => {
                  const statusStyle = getMaterialStatusStyle(item.status);
                  const percent = item.budget > 0 ? (item.used / item.budget) * 100 : 0;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-card bg-nuan-white border border-fu-gray/10 hover:shadow-hover transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-body font-semibold text-mo-black">
                            {item.name}
                          </h3>
                          <p className="text-helper text-fu-gray mt-1 flex items-center gap-1">
                            <span>🛒</span>
                            {item.channel}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-tag text-helper font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-1">
                          <div className="w-full bg-mi-white rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${
                                percent > 90 ? 'bg-zhu-red' : percent > 70 ? 'bg-orange-500' : 'bg-zhu-green'
                              }`}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-helper text-fu-gray">
                              已用 ¥{item.used.toLocaleString()}
                            </span>
                            <span className="text-helper text-fu-gray">
                              {percent.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-body font-bold text-mo-black">
                            ¥{item.budget.toLocaleString()}
                          </p>
                          <p className="text-helper text-fu-gray">预算</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" onClick={() => setView('sop')}>
                返回SOP流程
              </Button>
              <Button variant="primary" onClick={() => setView('nian')}>
                找年兽聊聊
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showWarningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-nuan-white rounded-card shadow-lg max-w-md w-full p-6 animate-modal-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-zhu-red/10 rounded-full flex items-center justify-center mb-4 pulse-glow">
                <span className="text-4xl">⚠️</span>
              </div>
              <h2 className="text-title font-bold text-zhu-red mb-2">
                预算预警
              </h2>
              <p className="text-body text-mo-black">
                您的装修预算已使用 <span className="font-bold text-zhu-red">{usagePercent.toFixed(0)}%</span>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-mi-white rounded-card">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <h3 className="text-body font-semibold text-mo-black">10%上限提示</h3>
                    <p className="text-helper text-fu-gray mt-1">
                      增项费用不得超过合同总价的10%，超过部分您有权拒绝支付
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-mi-white rounded-card">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📝</span>
                  <div>
                    <h3 className="text-body font-semibold text-mo-black">书面确认提醒</h3>
                    <p className="text-helper text-fu-gray mt-1">
                      所有增项必须有您的书面签字确认，口头承诺无效
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-card border-l-4 border-orange-400">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <h3 className="text-body font-semibold text-orange-800">年兽建议</h3>
                    <p className="text-helper text-orange-700 mt-1">
                      优先使用备用金，必要时可考虑削减非必要项目，避免超支过多
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowWarningModal(false)}>
                知道了
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => setView('nian')}>
                找年兽帮忙
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetView;
