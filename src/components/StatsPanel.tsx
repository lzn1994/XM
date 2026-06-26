import React from 'react';
import type { NianProgress } from '../types';
import { getLevelInfo, nianLevels } from '../data/nian-data';

interface StatsPanelProps {
  nianProgress: NianProgress;
  className?: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ nianProgress, className = '' }) => {
  const { level, spiritPoints, jadeStones, houseScore, streakDays } = nianProgress;
  const { currentLevel, nextLevel } = getLevelInfo(level);

  const currentLevelMin = currentLevel.minSpirit;
  const nextLevelMin = nextLevel.minSpirit;
  const progress = nextLevelMin > currentLevelMin
    ? ((spiritPoints - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100
    : 100;

  const isMaxLevel = currentLevel.level === nianLevels[nianLevels.length - 1].level;

  return (
    <div className={`bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-[var(--spacing-card-padding)] ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-zhu-red to-tan-brown flex items-center justify-center text-white text-2xl font-bold">
          {level}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[var(--font-size-module-title)] font-semibold text-[var(--color-text)] truncate">
            {currentLevel.name}
          </h3>
          <p className="text-[var(--font-size-helper)] text-[var(--color-text-secondary)] mt-1 truncate">
            {currentLevel.description}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--font-size-helper)] text-[var(--color-text-secondary)]">
            {isMaxLevel ? '已满级' : `距离 ${nextLevel.name}`}
          </span>
          <span className="text-[var(--font-size-helper)] font-medium text-dai-blue">
            {isMaxLevel ? 'MAX' : `${Math.floor(progress)}%`}
          </span>
        </div>
        <div className="w-full bg-fu-gray/20 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-dai-blue to-zhu-green transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        {!isMaxLevel && (
          <p className="text-[var(--font-size-helper)] text-fu-gray mt-1.5">
            {spiritPoints} / {nextLevelMin} 灵气
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-mi-white rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">✨</div>
          <div className="text-lg font-bold text-mo-black">{spiritPoints}</div>
          <div className="text-xs text-fu-gray">灵气值</div>
        </div>
        <div className="bg-mi-white rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">💎</div>
          <div className="text-lg font-bold text-mo-black">{jadeStones}</div>
          <div className="text-xs text-fu-gray">装修玉石</div>
        </div>
        <div className="bg-mi-white rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🏠</div>
          <div className="text-lg font-bold text-mo-black">{houseScore}</div>
          <div className="text-xs text-fu-gray">房子评分</div>
        </div>
        <div className="bg-mi-white rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-lg font-bold text-mo-black">{streakDays}</div>
          <div className="text-xs text-fu-gray">连续签到</div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
