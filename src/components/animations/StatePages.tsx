import React from 'react';
import NianAvatar from '../NianAvatar';
import Button from '../Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description = '这里还什么都没有呢~',
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div className="relative mb-6">
        <NianAvatar size={120} emotion="confused" />
        <div
          className="absolute -top-2 -right-2 text-3xl"
          style={{ animation: 'bounce 2s infinite' }}
        >
          {icon || '🤔'}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-mo-black mb-2">{title}</h3>
      <p className="text-sm text-fu-gray text-center max-w-xs mb-6">{description}</p>
      
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

interface LoadingStateProps {
  text?: string;
  fullScreen?: boolean;
  variant?: 'ink' | 'spinner';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  text = '加载中...',
  fullScreen = false,
  variant = 'ink',
}) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 bg-nuan-white/90 flex items-center justify-center z-50'
    : 'flex flex-col items-center justify-center py-12';

  if (variant === 'ink') {
    return (
      <div className={containerClass}>
        <div className="relative" style={{ width: 100, height: 100 }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(44,44,44,0.2) 0%, transparent 70%)`,
                animation: `inkWave 2s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-mo-black opacity-30" />
          </div>
        </div>
        <p className="mt-6 text-body text-fu-gray">{text}</p>

        <style>{`
          @keyframes inkWave {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div
        className="w-10 h-10 border-4 border-dai-blue/20 border-t-dai-blue rounded-full"
        style={{ animation: 'spin 0.8s linear infinite' }}
      />
      <p className="mt-4 text-body text-fu-gray">{text}</p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = '出错了',
  description = '哎呀，好像出了点小问题...',
  error,
  onRetry,
  onBack,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div className="relative mb-6">
        <NianAvatar size={120} emotion="confused" />
        <div
          className="absolute -top-2 -right-2 text-3xl"
          style={{ animation: 'shake 0.5s ease-in-out infinite' }}
        >
          😵
        </div>
      </div>

      <h3 className="text-lg font-semibold text-mo-black mb-2">{title}</h3>
      <p className="text-sm text-fu-gray text-center max-w-xs mb-2">{description}</p>
      
      {error && (
        <p className="text-xs text-zhu-red/70 text-center max-w-xs mb-6 bg-zhu-red/5 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            返回
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            重试
          </Button>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-3px) rotate(-5deg); }
          75% { transform: translateX(3px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

interface SuccessStateProps {
  title?: string;
  description?: string;
  icon?: string;
  rewardText?: string;
  actionText?: string;
  onAction?: () => void;
  onClose?: () => void;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title = '成功！',
  description = '太棒了，任务完成！',
  icon = '🎉',
  rewardText,
  actionText,
  onAction,
  onClose,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div className="relative mb-6">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(91,140,90,0.3) 0%, transparent 70%)',
            animation: 'glow 2s ease-in-out infinite',
            transform: 'scale(1.5)',
          }}
        />
        <NianAvatar size={120} emotion="happy" />
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl"
          style={{ animation: 'bounce 1s infinite' }}
        >
          {icon}
        </div>
      </div>

      <h3 className="text-xl font-bold text-zhu-green mb-2">{title}</h3>
      <p className="text-sm text-fu-gray text-center max-w-xs mb-4">{description}</p>

      {rewardText && (
        <div className="bg-zhu-green/10 px-6 py-3 rounded-full mb-6">
          <span className="text-zhu-green font-semibold">✨ {rewardText}</span>
        </div>
      )}

      <div className="flex gap-3">
        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            关闭
          </Button>
        )}
        {actionText && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>

      <style>{`
        @keyframes glow {
          0%, 100% { opacity: 0.5; transform: scale(1.3); }
          50% { opacity: 1; transform: scale(1.8); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

const StatePages = {
  EmptyState,
  LoadingState,
  ErrorState,
  SuccessState,
};

export default StatePages;
