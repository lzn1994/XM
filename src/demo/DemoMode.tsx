import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DemoActor } from './DemoActor';
import type { DemoActorState, DemoActorCallbacks } from './DemoActor';
import type { ViewType } from '../hooks/useAppState';
import { useAppState } from '../hooks/useAppState';
import { getDemoData } from '../data/mock-demo';
import NianAvatar from '../components/NianAvatar';

interface DemoModeProps {
  isActive: boolean;
  onClose: (keepData?: boolean) => void;
}

const DemoMode: React.FC<DemoModeProps> = ({ isActive, onClose }) => {
  const { state, dispatch, setView } = useAppState();
  const actorRef = useRef<DemoActor | null>(null);
  const [actorState, setActorState] = useState<DemoActorState | null>(null);
  const [spotlightRect, setSpotlightRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    shape: 'circle' | 'rect';
  } | null>(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [savedState, setSavedState] = useState<any>(null);

  const handleStateChange = useCallback((newState: DemoActorState) => {
    setActorState(newState);
  }, []);

  const handleNavigate = useCallback(
    (view: ViewType) => {
      setView(view);
    },
    [setView]
  );

  const handleComplete = useCallback(() => {
    setShowEndDialog(true);
  }, []);

  useEffect(() => {
    if (isActive && !actorRef.current) {
      setSavedState({ ...state });

      const demoData = getDemoData();
      dispatch({ type: 'UPDATE_USER_SESSION', payload: demoData.userSession });
      dispatch({
        type: 'UPDATE_SOP_PROGRESS',
        payload: {
          currentStep: demoData.currentStepId,
          completedSteps: Array.from({ length: demoData.currentStepId }, (_, i) => i + 1),
          stageUnlockStatus: [true, true, true, true, false, false],
        },
      });
      dispatch({ type: 'UPDATE_NIAN_PROGRESS', payload: demoData.nianProgress });

      const callbacks: DemoActorCallbacks = {
        onStateChange: handleStateChange,
        onNavigate: handleNavigate,
        onComplete: handleComplete,
      };

      const actor = new DemoActor(callbacks);
      actorRef.current = actor;
      actor.start();
    }

    return () => {
      if (actorRef.current) {
        actorRef.current.destroy();
        actorRef.current = null;
      }
    };
  }, [isActive, dispatch, handleStateChange, handleNavigate, handleComplete, state]);

  useEffect(() => {
    if (!actorState?.spotlight) {
      setSpotlightRect(null);
      return;
    }

    const spotlight = actorState.spotlight;

    if (spotlight.selector) {
      const updateSpotlight = () => {
        const element = document.querySelector(spotlight.selector!);
        if (element) {
          const rect = element.getBoundingClientRect();
          const padding = spotlight.padding || 10;
          setSpotlightRect({
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
            shape: spotlight.shape,
          });
        } else {
          setSpotlightRect(null);
        }
      };

      updateSpotlight();
      const interval = setInterval(updateSpotlight, 100);
      return () => clearInterval(interval);
    } else if (spotlight.position) {
      setSpotlightRect({
        x: spotlight.position.x,
        y: spotlight.position.y,
        width: spotlight.position.width,
        height: spotlight.position.height,
        shape: spotlight.shape,
      });
    }
  }, [actorState?.spotlight]);

  const handlePauseResume = () => {
    if (!actorRef.current) return;
    const currentState = actorRef.current.getState();
    if (currentState.status === 'playing') {
      actorRef.current.pause();
    } else if (currentState.status === 'paused') {
      actorRef.current.resume();
    }
  };

  const handleSkipChapter = () => {
    actorRef.current?.skipChapter();
  };

  const handleEndDemo = (keepData: boolean) => {
    if (!keepData && savedState) {
      dispatch({ type: 'SET_USER_SESSION', payload: savedState.userSession });
      dispatch({ type: 'UPDATE_SOP_PROGRESS', payload: savedState.sopProgress });
      dispatch({ type: 'UPDATE_NIAN_PROGRESS', payload: savedState.nianProgress });
    }
    setView('hero');
    onClose(keepData);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive || !actorState) return null;

  const totalDuration = actorRef.current?.getTotalDuration() || 120;
  const remainingTime = Math.max(0, totalDuration - actorState.elapsedTime);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <style>{`
        @keyframes spot-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes narration-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes progress-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(74, 111, 165, 0.5); }
          50% { box-shadow: 0 0 20px rgba(74, 111, 165, 0.8); }
        }
        .demo-spotlight-mask {
          animation: spot-pulse 2s ease-in-out infinite;
        }
        .demo-narration {
          animation: narration-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .demo-progress-glow {
          animation: progress-glow 2s ease-in-out infinite;
        }
      `}</style>

      {spotlightRect && (
        <div
          className="absolute inset-0 demo-spotlight-mask"
          style={{
            pointerEvents: 'none',
          }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                {spotlightRect.shape === 'circle' ? (
                  <circle
                    cx={spotlightRect.x + spotlightRect.width / 2}
                    cy={spotlightRect.y + spotlightRect.height / 2}
                    r={Math.max(spotlightRect.width, spotlightRect.height) / 2}
                    fill="black"
                  />
                ) : (
                  <rect
                    x={spotlightRect.x}
                    y={spotlightRect.y}
                    width={spotlightRect.width}
                    height={spotlightRect.height}
                    rx="12"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.6)"
              mask="url(#spotlight-mask)"
            />
          </svg>
          {spotlightRect.shape === 'circle' ? (
            <div
              className="absolute rounded-full border-2 border-[var(--color-primary)]"
              style={{
                left: spotlightRect.x,
                top: spotlightRect.y,
                width: spotlightRect.width,
                height: spotlightRect.height,
                boxShadow: '0 0 30px rgba(74, 111, 165, 0.5), inset 0 0 20px rgba(74, 111, 165, 0.2)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          ) : (
            <div
              className="absolute rounded-xl border-2 border-[var(--color-primary)]"
              style={{
                left: spotlightRect.x,
                top: spotlightRect.y,
                width: spotlightRect.width,
                height: spotlightRect.height,
                boxShadow: '0 0 30px rgba(74, 111, 165, 0.5), inset 0 0 20px rgba(74, 111, 165, 0.2)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
        </div>
      )}

      {!spotlightRect && (
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none',
          }}
        />
      )}

      {actorState.narration && (
        <div
          className="demo-narration absolute flex items-center gap-3 pointer-events-auto"
          style={{
            ...(actorState.narration.position === 'top' && {
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
            }),
            ...(actorState.narration.position === 'bottom' && {
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
            }),
            ...(actorState.narration.position === 'left' && {
              left: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
            }),
            ...(actorState.narration.position === 'right' && {
              right: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
            }),
            zIndex: 10000,
          }}
        >
          <div className="flex-shrink-0">
            <NianAvatar size={50} emotion="happy" />
          </div>
          <div
            className="relative px-5 py-3 rounded-2xl shadow-lg max-w-xs"
            style={{
              background: 'var(--color-surface)',
              border: '2px solid var(--color-primary)',
            }}
          >
            <div
              className="absolute w-4 h-4 rotate-45"
              style={{
                background: 'var(--color-surface)',
                borderRight: '2px solid var(--color-primary)',
                borderBottom: '2px solid var(--color-primary)',
                ...(actorState.narration.position === 'left' && {
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(45deg)',
                  borderRight: 'none',
                  borderLeft: '2px solid var(--color-primary)',
                }),
                ...(actorState.narration.position === 'right' && {
                  right: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(45deg)',
                  borderLeft: 'none',
                  borderRight: '2px solid var(--color-primary)',
                }),
                ...(actorState.narration.position === 'top' && {
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  borderBottom: 'none',
                  borderTop: '2px solid var(--color-primary)',
                }),
                ...(actorState.narration.position === 'bottom' && {
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  borderTop: 'none',
                  borderBottom: '2px solid var(--color-primary)',
                }),
              }}
            />
            <p
              className="text-base font-medium leading-relaxed"
              style={{ color: 'var(--color-text)' }}
            >
              {actorState.narration.text}
            </p>
          </div>
        </div>
      )}

      <div
        className="absolute top-0 left-0 right-0 pointer-events-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(250,247,242,0.95) 0%, rgba(250,247,242,0.8) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(74, 111, 165, 0.2)',
          zIndex: 10001,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                }}
              >
                第 {actorState.currentChapterIndex + 1} 章
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {actorState.currentChapter?.title || ''}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {actorState.currentChapter?.subtitle || ''}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                剩余 {formatTime(remainingTime)}
              </div>
              <button
                onClick={handlePauseResume}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'var(--color-surface)',
                  border: '2px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                }}
                title={actorState.status === 'playing' ? '暂停' : '继续'}
              >
                {actorState.status === 'playing' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleSkipChapter}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-text-secondary)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                跳过章节
              </button>
              <button
                onClick={() => setShowEndDialog(true)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: 'rgba(200, 74, 62, 0.1)',
                  border: '1px solid var(--color-secondary)',
                  color: 'var(--color-secondary)',
                }}
              >
                结束演示
              </button>
            </div>
          </div>
          <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74, 111, 165, 0.15)' }}>
            <div
              className="absolute left-0 top-0 h-full rounded-full demo-progress-glow transition-all duration-100"
              style={{
                width: `${actorState.overallProgress}%`,
                background: 'linear-gradient(90deg, var(--color-primary) 0%, #6B8FC5 100%)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <div className="flex gap-1">
              {actorRef.current?.getChapters().map((ch, i) => (
                <div
                  key={ch.id}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${(ch.duration / totalDuration) * 100}%`,
                    background:
                      i < actorState.currentChapterIndex
                        ? 'var(--color-primary)'
                        : i === actorState.currentChapterIndex
                        ? 'transparent'
                        : 'rgba(74, 111, 165, 0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showEndDialog && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10002,
          }}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            style={{
              background: 'var(--color-surface)',
              animation: 'narration-in 0.3s ease-out',
            }}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎬</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                演示结束
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                感谢观看「我的宝贝房子」演示
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleEndDemo(true)}
                className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-102"
                style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                }}
              >
                保留数据，继续探索
              </button>
              <button
                onClick={() => handleEndDemo(false)}
                className="w-full py-3 rounded-xl font-medium transition-all"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-text-secondary)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                返回初始状态
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoMode;
