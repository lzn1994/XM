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
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 xl:w-64 bg-nuan-white border-r border-ink-light z-50 shadow-card overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(58, 90, 140, 0.02) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 111, 71, 0.02) 0%, transparent 50%)'
      }} />
      
      <div className="relative p-5 border-b border-ink-light">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dai-blue to-zhu-green flex items-center justify-center text-white text-xl shadow-md relative">
            <span className="absolute inset-0 rounded-xl border-2 border-double border-white/20" />
            🏮
          </div>
          <div>
            <h1 className="text-module-title font-bold text-mo-black leading-tight font-kai">
              我的宝贝房子
            </h1>
            <p className="text-helper text-fu-gray">新中式装修助手</p>
          </div>
        </div>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-tan-brown/30 to-transparent" />
      </div>

      <nav className="flex-1 p-3 overflow-y-auto relative">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-dai text-white shadow-glow-dai font-semibold'
                    : 'text-mo-black hover:bg-mi-white hover:text-dai-blue'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-zhu-green rounded-r" />
                )}
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-nuan-white" />
                )}
                <span className={`text-xl transition-transform duration-200 relative z-10 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-body relative z-10">{item.label}</span>
                {isActive && (
                  <span className="ml-auto relative z-10">
                    <span className="text-xs bg-zhu-green/30 text-white px-1.5 py-0.5 rounded">
                      进行中
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="my-4 border-t border-ink-light relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-nuan-white px-2 text-helper text-fu-gray">
            更多功能
          </span>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => handleNavClick('onboarding')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group relative overflow-hidden ${
              currentView === 'onboarding'
                ? 'bg-gradient-dai text-white shadow-glow-dai font-semibold'
                : 'text-mo-black hover:bg-mi-white hover:text-dai-blue'
            }`}
          >
            {currentView === 'onboarding' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-zhu-green rounded-r" />
            )}
            <span className={`text-xl transition-transform duration-200 relative z-10 ${currentView === 'onboarding' ? '' : 'group-hover:scale-110'}`}>
              🎨
            </span>
            <span className="text-body relative z-10">风格探测</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-ink-light bg-mi-white/50 relative">
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-tan-brown/20 to-transparent" />
        <div className="flex items-center gap-3 p-3 rounded-xl bg-nuan-white shadow-card border border-ink-light relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dai-blue via-zhu-green to-tan-brown opacity-60" />
          <NianAvatar size={48} level={nianProgress.level} emotion={nianProgress.emotion} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-body font-semibold text-mo-black truncate font-kai">年兽宝宝</span>
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
            <div className="w-full bg-fu-gray/20 rounded-full h-1.5 mt-1.5">
              <div
                className="bg-gradient-to-r from-zhu-green to-dai-blue h-1.5 rounded-full transition-all duration-500"
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
    <header className="hidden md:flex lg:hidden fixed top-0 left-0 right-0 h-14 bg-nuan-white border-b border-ink-light z-50 shadow-soft">
      <div className="flex items-center gap-2 px-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dai-blue to-zhu-green flex items-center justify-center text-white text-sm shadow-sm">
          🏮
        </div>
        <span className="text-module-title font-bold text-mo-black font-kai">我的宝贝房子</span>
      </div>

      <nav className="flex-1 flex items-center justify-center gap-1 px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-dai text-white shadow-md'
                  : 'text-mo-black hover:bg-mi-white hover:text-dai-blue'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zhu-green" />
              )}
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-nuan-white border-t border-ink-light z-50 shadow-[0_-2px_12px_rgba(58,90,140,0.06)]">
      <div className="flex justify-around items-center py-1.5">
        {mobileTabItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-300 min-w-[60px] relative ${
                isActive
                  ? 'text-dai-blue'
                  : 'text-fu-gray'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-dai-blue to-zhu-green rounded-b-full" />
              )}
              <span className={`text-2xl transition-all duration-300 ${
                isActive ? 'scale-110' : ''
              }`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium ${
                isActive ? 'text-dai-blue font-semibold' : 'text-fu-gray'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );

  return (
    <div className="min-h-screen bg-mi-white relative">
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-dai-blue/[0.03] to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-zhu-green/[0.03] to-transparent rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />
      <SidebarNav />
      <TopTabNav />
      <main className="lg:pl-60 xl:pl-64 md:pt-14 pb-16 md:pb-0 relative z-10">
        {children}
      </main>
      <BottomTabNav />
    </div>
  );
};

export default Navigation;
