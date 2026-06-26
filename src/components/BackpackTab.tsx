import React, { useState } from 'react';
import { equipmentList, getUnlockedEquipment } from '../data/nian-data';
import type { Equipment } from '../types';

interface BackpackTabProps {
  level: number;
  equippedItems?: Equipment[];
  onEquip?: (equipment: Equipment) => void;
  className?: string;
}

const propItems = [
  { id: 'prop-1', name: '经验药水', description: '使用后获得100灵气值', icon: '🧪', count: 3, rarity: 'common' },
  { id: 'prop-2', name: '装修图纸', description: '解锁一个隐藏装修风格', icon: '📜', count: 1, rarity: 'rare' },
  { id: 'prop-3', name: '幸运符', description: '下次任务奖励翻倍', icon: '🍀', count: 2, rarity: 'rare' },
  { id: 'prop-4', name: '时光沙漏', description: '加速一个装修步骤', icon: '⏳', count: 1, rarity: 'epic' },
];

const rarityColors: Record<string, string> = {
  common: 'border-fu-gray/30 bg-fu-gray/5',
  rare: 'border-dai-blue/30 bg-dai-blue/5',
  epic: 'border-zhu-red/30 bg-zhu-red/5',
  legendary: 'border-tan-brown/30 bg-tan-brown/5',
};

const rarityTextColors: Record<string, string> = {
  common: 'text-fu-gray',
  rare: 'text-dai-blue',
  epic: 'text-zhu-red',
  legendary: 'text-tan-brown',
};

export const BackpackTab: React.FC<BackpackTabProps> = ({
  level,
  equippedItems = [],
  onEquip,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<'equipment' | 'props'>('equipment');
  const unlockedEquip = getUnlockedEquipment(level);
  const lockedEquip = equipmentList.filter((e) => e.unlockLevel > level && e.id !== 'none');

  return (
    <div className={`${className}`}>
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeCategory === 'equipment'
              ? 'bg-dai-blue text-white'
              : 'bg-mi-white text-fu-gray hover:bg-nuan-white'
          }`}
          onClick={() => setActiveCategory('equipment')}
        >
          装备
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeCategory === 'props'
              ? 'bg-dai-blue text-white'
              : 'bg-mi-white text-fu-gray hover:bg-nuan-white'
          }`}
          onClick={() => setActiveCategory('props')}
        >
          道具
        </button>
      </div>

      {activeCategory === 'equipment' && (
        <div>
          <div className="mb-4">
            <h4 className="text-body font-semibold text-mo-black mb-3">已解锁装备</h4>
            <div className="grid grid-cols-2 gap-3">
              {unlockedEquip.length > 0 ? (
                unlockedEquip.map((eq) => {
                  const isEquipped = equippedItems.some((e) => e.id === eq.id);
                  return (
                    <div
                      key={eq.id}
                      className={`bg-nuan-white rounded-lg p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
                        isEquipped ? 'border-zhu-green' : 'border-transparent'
                      }`}
                      onClick={() => onEquip?.(eq)}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{eq.icon}</div>
                        <h5 className="font-medium text-mo-black text-sm">{eq.name}</h5>
                        <p className="text-xs text-fu-gray mt-1 line-clamp-2">{eq.description}</p>
                        {isEquipped && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-zhu-green/10 text-zhu-green text-xs rounded">
                            已装备
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8 text-fu-gray">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm">暂无已解锁装备</p>
                  <p className="text-xs mt-1">完成任务提升等级解锁更多装备</p>
                </div>
              )}
            </div>
          </div>

          {lockedEquip.length > 0 && (
            <div>
              <h4 className="text-body font-semibold text-mo-black mb-3">未解锁装备</h4>
              <div className="grid grid-cols-2 gap-3">
                {lockedEquip.map((eq) => (
                  <div
                    key={eq.id}
                    className="bg-mi-white rounded-lg p-3 border border-fu-gray/10 opacity-60"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2 grayscale">{eq.icon}</div>
                      <h5 className="font-medium text-mo-black text-sm">{eq.name}</h5>
                      <p className="text-xs text-fu-gray mt-1">
                        Lv.{eq.unlockLevel} 解锁
                      </p>
                      <div className="mt-2">
                        <span className="text-lg">🔒</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeCategory === 'props' && (
        <div className="grid grid-cols-2 gap-3">
          {propItems.map((item) => (
            <div
              key={item.id}
              className={`bg-nuan-white rounded-lg p-3 border-2 transition-all hover:shadow-md ${rarityColors[item.rarity]}`}
            >
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <span className="absolute -top-1 -right-2 bg-mo-black text-white text-xs px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                </div>
                <h5 className={`font-medium text-sm ${rarityTextColors[item.rarity]}`}>
                  {item.name}
                </h5>
                <p className="text-xs text-fu-gray mt-1 line-clamp-2">{item.description}</p>
                <button className="mt-2 px-3 py-1 bg-dai-blue text-white text-xs rounded hover:opacity-90 transition-opacity">
                  使用
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BackpackTab;
