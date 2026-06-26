import React from 'react';
import { useAppState } from '../hooks/useAppState';
import type { ViewType } from '../hooks/useAppState';
import NianAvatar from './NianAvatar';

interface NavItem {
  id: ViewType;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: '首页', icon: '🏠' },
  { id: 'sop', label: 'SOP流程', icon: '📋' },
  { id: 'budget', label: '预算管理', icon: '💰' },
  { id: 'nian', label: '年兽养成', icon: '🐲' },
];

const mobileTabItems: NavItem[] = [
  { id: 'hero', label: '首页', icon: '🏠' },
  { id: 'sop', label: 'SOP', icon: '📋' },
  { id: 'budget', label: '预算', icon: '💰' },
  { id: 'nian', label: '年兽', icon: '🐲' },
  { id: 'onboarding', label: '更多', icon: '⋯' },
];

interface NavigationProps {
  children: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const { state, setView } = useAppState();
  const { currentView, nianProgress } = state;

  const handleNavClick = (view: ViewType) => {
    if (view !== currentView) {
      setView(view);
    }
  };

  const SidebarNav = () => (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-56 xl:w-60 bg-nuan-white border-r border-fu-gray/10 z-50 shadow-card">
      <div className="p-5 border-b border-fu-gray/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dai-blue to-zhu-green flex items-center justify-center text-white text-xl shadow-md">
            🏮
          </div>
          <div>
            <h1 className="text-module-title font-bold text-mo-black leading-tight">
              我的宝贝房子
            </h1>
            <p className="text-helper text-fu-gray">新中式装修助手</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-card text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-dai-blue text-zhu-green font-semibold shadow-md'
                    : 'text-mo-black hover:bg-mi-white hover:text-dai-blue'
                }`}
              >
                <span className={`text-xl transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-body">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-zhu-green" />
                )}
              </button>
            );
          })}
        </div>

        <div className="my-4 border-t border-fu-gray/10" />

        <div className="space-y-1">
          <button
            onClick={() => handleNavClick('onboarding')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-card text-left transition-all duration-200 group ${
              currentView === 'onboarding'
                ? 'bg-dai-blue text-zhu-green font-semibold shadow-md'
                : 'text-mo-black hover:bg-mi-white hover:text-dai-blue'
            }`}
          >
            <span className={`text-xl transition-transform duration-200 ${currentView === 'onboarding' ? '' : 'group-hover:scale-110'}`}>
              🎨
            </span>
            <span className="text-body">风格探测</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-fu-gray/10 bg-mi-white/50">
        <div className="flex items-center gap-3 p-3 rounded-card bg-nuan-white shadow-sm">
          <NianAvatar size={44} level={nianProgress.level} emotion={nianProgress.emotion} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-body font-semibold text-mo-black truncate">年兽宝宝</span>
              <span className="px-1.5 py-0.5 bg-dai-blue/10 text-dai-blue text-[10px] font-medium rounded-tag flex-shrink-0">
                Lv.{nianProgress.level}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-zhu-green">✨</span>
              <span className="text-helper text-fu-gray truncate">
                灵气 {nianProgress.spiritPoints}
              </span>
            </div>
            <div className="w-full bg-fu-gray/20 rounded-full h-1 mt-1.5">
              <div
                className="bg-gradient-to-r from-zhu-green to-dai-blue h-1 rounded-full transition-all duration-300"
                style={{
                  width: `${((nianProgress.spiritPoints % 500) / 500) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  const TopTabNav = () => (
    <header className="hidden md:flex lg:hidden fixed top-0 left-0 right-0 h-14 bg-nuan-white border-b border-fu-gray/10 z-50 shadow-sm">
      <div className="flex items-center gap-2 px-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dai-blue to-zhu-green flex items-center justify-center text-white text-sm shadow-sm">
          🏮
        </div>
        <span className="text-module-title font-bold text-mo-black">我的宝贝房子</span>
      </div>

      <nav className="flex-1 flex items-center justify-center gap-1 px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-tag text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-dai-blue text-white shadow-md'
                  : 'text-mo-black hover:bg-mi-white hover:text-dai-blue'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 px-4">
        <div className="w-8 h-8 rounded-full bg-mi-white flex items-center justify-center text-sm">
          ✨
        </div>
        <span className="text-helper text-fu-gray hidden xl:inline">
          Lv.{nianProgress.level}
        </span>
      </div>
    </header>
  );

  const BottomTabNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-nuan-white border-t border-fu-gray/10 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center py-1.5">
        {mobileTabItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive
                  ? 'text-dai-blue'
                  : 'text-fu-gray'
              }`}
            >
              <span className={`text-2xl transition-transform duration-200 ${
                isActive ? 'scale-110' : ''
              }`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium ${
                isActive ? 'text-dai-blue' : 'text-fu-gray'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-dai-blue mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );

  return (
    <div className="min-h-screen bg-mi-white">
      <SidebarNav />
      <TopTabNav />
      <main className="lg:pl-56 xl:pl-60 md:pt-14 pb-16 md:pb-0">
        {children}
      </main>
      <BottomTabNav />
    </div>
  );
};

export default Navigation;
