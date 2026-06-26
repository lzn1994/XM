import React, { useState, useMemo } from 'react';
import { useAppState } from '../hooks/useAppState';
import NianAvatar from '../components/NianAvatar';
import HouseScene from '../components/HouseScene';
import StatsPanel from '../components/StatsPanel';
import TasksTab from '../components/TasksTab';
import BackpackTab from '../components/BackpackTab';
import SettingsTab from '../components/SettingsTab';
import { getHouseStageBySopStep, getUnlockedEquipment, calculateSpiritGain } from '../data/nian-data';
import type { Equipment } from '../types';

type TabType = 'house' | 'tasks' | 'backpack' | 'settings';

const nianQuotes = [
  '装修要一步一步来哦，别急~',
  '今天也要元气满满地装修呀！',
  '预算要精打细算，不然会超支的！',
  '水电改造很重要，一定要仔细检查~',
  '选材料要环保，住得才健康！',
  '有什么不懂的尽管问我~',
  '装修累了就休息一下吧😴',
  '相信你一定能装出梦想中的家！',
  '瓷砖要贴平整，不然以后会空鼓的',
  '今天也是充满灵气的一天✨',
  '记得多通风，甲醛要散掉哦~',
  '配色要协调，家才会温馨！',
];

const NianView: React.FC = () => {
  const { state, dispatch, setView } = useAppState();
  const { nianProgress, sopProgress } = state;
  const [activeTab, setActiveTab] = useState<TabType>('house');
  const [showDialog, setShowDialog] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(nianQuotes[0]);
  const [showSpiritGain, setShowSpiritGain] = useState(false);
  const [spiritGainAmount, setSpiritGainAmount] = useState(0);

  const houseStage = useMemo(
    () => getHouseStageBySopStep(sopProgress.currentStep),
    [sopProgress.currentStep]
  );

  const unlockedEquipment = useMemo(
    () => getUnlockedEquipment(nianProgress.level),
    [nianProgress.level]
  );

  const handleNianClick = () => {
    const randomQuote = nianQuotes[Math.floor(Math.random() * nianQuotes.length)];
    setCurrentQuote(randomQuote);
    setShowDialog(true);

    const gain = calculateSpiritGain('ai-use');
    setSpiritGainAmount(gain);
    setShowSpiritGain(true);

    const newSpirit = nianProgress.spiritPoints + gain;
    const spiritPerLevel = 500;
    const newLevel = Math.floor(newSpirit / spiritPerLevel) + 1;

    dispatch({
      type: 'UPDATE_NIAN_PROGRESS',
      payload: {
        spiritPoints: newSpirit,
        level: newLevel,
      },
    });

    setTimeout(() => {
      setShowDialog(false);
      setShowSpiritGain(false);
    }, 2500);
  };

  const handleEquip = (equipment: Equipment) => {
    const isEquipped = nianProgress.equipment.some((e) => e.id === equipment.id);
    let newEquipment: Equipment[];
    if (isEquipped) {
      newEquipment = nianProgress.equipment.filter((e) => e.id !== equipment.id);
    } else {
      newEquipment = [...nianProgress.equipment, equipment];
    }
    dispatch({
      type: 'UPDATE_NIAN_PROGRESS',
      payload: { equipment: newEquipment },
    });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_STATE' });
    setView('hero');
  };

  const handleClaimTask = (_taskId: string, reward: number, type: string) => {
    if (type === 'spirit') {
      const newSpirit = nianProgress.spiritPoints + reward;
      const spiritPerLevel = 500;
      const newLevel = Math.floor(newSpirit / spiritPerLevel) + 1;
      dispatch({
        type: 'UPDATE_NIAN_PROGRESS',
        payload: {
          spiritPoints: newSpirit,
          level: newLevel,
        },
      });
    } else if (type === 'jade') {
      dispatch({
        type: 'UPDATE_NIAN_PROGRESS',
        payload: { jadeStones: nianProgress.jadeStones + reward },
      });
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'house', label: '房子', icon: '🏠' },
    { id: 'tasks', label: '任务', icon: '📋' },
    { id: 'backpack', label: '背包', icon: '🎒' },
    { id: 'settings', label: '设置', icon: '⚙️' },
  ];

  const renderHouseTab = () => (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 flex flex-col">
        <div className="bg-nuan-white rounded-xl overflow-hidden shadow-card relative">
          <HouseScene currentStep={sopProgress.currentStep} className="house-scene w-full" />
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
            <NianAvatar
              size={140}
              level={nianProgress.level}
              emotion={nianProgress.emotion}
              equipment={unlockedEquipment}
              isInteractive={true}
              onBow={handleNianClick}
              className="nian-avatar"
            />
          </div>
          {showDialog && (
            <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-20 animate-bounce-in">
              <div className="bg-nuan-white px-5 py-3 rounded-2xl shadow-lg border-2 border-dai-blue/20 max-w-xs relative">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-nuan-white rotate-45 border-r-2 border-b-2 border-dai-blue/20" />
                <p className="text-body text-mo-black text-center">{currentQuote}</p>
              </div>
            </div>
          )}
          {showSpiritGain && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 animate-float-up pointer-events-none">
              <div className="text-zhu-green font-bold text-lg">
                +{spiritGainAmount} ✨
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 bg-nuan-white rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-module-title font-semibold text-mo-black">
              装修进度
            </h3>
            <span className="text-helper text-fu-gray">
              第 {sopProgress.currentStep} / {sopProgress.totalSteps} 步
            </span>
          </div>
          <div className="w-full bg-mi-white rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-zhu-green to-dai-blue h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(sopProgress.completedSteps.length / sopProgress.totalSteps) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-dai-blue/10 text-dai-blue rounded-tag text-xs font-medium">
                {houseStage.name}
              </span>
              <span className="text-helper text-fu-gray">
                阶段 {houseStage.stage + 1} / 6
              </span>
            </div>
            <button
              onClick={() => setView('sop')}
              className="text-sm text-dai-blue hover:underline"
            >
              查看详情 →
            </button>
          </div>
        </div>
      </div>

      <div className="lg:w-80 flex-shrink-0">
        <StatsPanel nianProgress={nianProgress} className="stats-panel" />
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-full bg-mi-white">
      <style>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: translateX(-50%) scale(0.8) translateY(10px); }
          50% { transform: translateX(-50%) scale(1.05) translateY(-2px); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes float-up {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-40px); }
        }
        .animate-float-up {
          animation: float-up 1.5s ease-out forwards;
        }
        @keyframes tab-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-tab-fade-in {
          animation: tab-fade-in 0.3s ease-out;
        }
      `}</style>

      <div className="bg-nuan-white border-b border-fu-gray/10 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-title font-bold text-mo-black">年兽陪伴</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-fu-gray">Lv.{nianProgress.level}</span>
          <div className="w-20 bg-mi-white rounded-full h-2">
            <div
              className="bg-zhu-green h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((nianProgress.spiritPoints % 500) / 500) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div key={activeTab} className="animate-tab-fade-in h-full">
          {activeTab === 'house' && renderHouseTab()}
          {activeTab === 'tasks' && <TasksTab onClaim={handleClaimTask} />}
          {activeTab === 'backpack' && (
            <BackpackTab
              level={nianProgress.level}
              equippedItems={nianProgress.equipment}
              onEquip={handleEquip}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              onReset={handleReset}
              onBackToHome={() => setView('hero')}
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-nuan-white border-t border-fu-gray/10 z-40 flex-shrink-0">
        <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'text-dai-blue'
                  : 'text-fu-gray hover:text-mo-black'
              }`}
            >
              <span className={`text-2xl transition-transform ${
                activeTab === tab.id ? 'scale-110' : ''
              }`}>
                {tab.icon}
              </span>
              <span className={`text-xs font-medium ${
                activeTab === tab.id ? 'text-dai-blue' : 'text-fu-gray'
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
};

export default NianView;
