import React, { useState } from 'react';
import Button from './Button';

interface SettingsTabProps {
  onReset?: () => void;
  onBackToHome?: () => void;
  className?: string;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  onReset,
  onBackToHome,
  className = '',
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    setShowResetConfirm(false);
    onReset?.();
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        <div className="bg-nuan-white rounded-lg overflow-hidden">
          <h4 className="text-helper text-fu-gray px-4 pt-3 pb-2">游戏设置</h4>
          <div className="divide-y divide-mi-white">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔊</span>
                <span className="text-body text-mo-black">音效</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  soundEnabled ? 'bg-zhu-green' : 'bg-fu-gray/30'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎵</span>
                <span className="text-body text-mo-black">背景音乐</span>
              </div>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  musicEnabled ? 'bg-zhu-green' : 'bg-fu-gray/30'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    musicEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <span className="text-body text-mo-black">消息通知</span>
              </div>
              <button
                onClick={() => setNotificationEnabled(!notificationEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  notificationEnabled ? 'bg-zhu-green' : 'bg-fu-gray/30'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    notificationEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-nuan-white rounded-lg overflow-hidden">
          <h4 className="text-helper text-fu-gray px-4 pt-3 pb-2">账号数据</h4>
          <div className="divide-y divide-mi-white">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-mi-white/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">💾</span>
                <span className="text-body text-mo-black">存档管理</span>
              </div>
              <span className="text-fu-gray">›</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-mi-white/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">📤</span>
                <span className="text-body text-mo-black">导出数据</span>
              </div>
              <span className="text-fu-gray">›</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-mi-white/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">📥</span>
                <span className="text-body text-mo-black">导入数据</span>
              </div>
              <span className="text-fu-gray">›</span>
            </div>
          </div>
        </div>

        <div className="bg-nuan-white rounded-lg overflow-hidden">
          <h4 className="text-helper text-fu-gray px-4 pt-3 pb-2">关于</h4>
          <div className="divide-y divide-mi-white">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📱</span>
                <span className="text-body text-mo-black">版本号</span>
              </div>
              <span className="text-helper text-fu-gray">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-mi-white/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">📖</span>
                <span className="text-body text-mo-black">使用说明</span>
              </div>
              <span className="text-fu-gray">›</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-mi-white/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <span className="text-body text-mo-black">意见反馈</span>
              </div>
              <span className="text-fu-gray">›</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-mi-white/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">⭐</span>
                <span className="text-body text-mo-black">给我们评分</span>
              </div>
              <span className="text-fu-gray">›</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {onBackToHome && (
            <Button variant="secondary" className="w-full" onClick={onBackToHome}>
              返回首页
            </Button>
          )}
          <Button
            variant="text"
            className="w-full text-zhu-red"
            onClick={() => setShowResetConfirm(true)}
          >
            重置游戏进度
          </Button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-nuan-white rounded-xl p-6 max-w-sm w-full animate-scale-in">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-mo-black mb-2">确认重置？</h3>
              <p className="text-body text-fu-gray">
                重置将清除所有游戏进度，包括年兽等级、装修进度、装备道具等，此操作不可恢复。
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowResetConfirm(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-zhu-red hover:bg-zhu-red/90"
                onClick={handleReset}
              >
                确认重置
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsTab;
