import React from 'react';

interface AILoaderProps {
  text?: string;
}

export const AILoader: React.FC<AILoaderProps> = ({ text = 'AI分析中...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-dai-blue/20 via-zhu-green/20 to-tan-brown/20 animate-ink-ripple-1" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-dai-blue/30 via-zhu-green/30 to-tan-brown/30 animate-ink-ripple-2" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-dai-blue/40 via-zhu-green/40 to-tan-brown/40 animate-ink-ripple-3" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl animate-nian-spin">🐲</div>
        </div>
      </div>

      <div className="w-64 mb-4">
        <div className="h-3 bg-nuan-white rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-dai-blue via-zhu-green to-tan-brown animate-brush-progress rounded-full" />
        </div>
      </div>

      <p className="text-body text-mo-black font-medium">{text}</p>

      <style>{`
        @keyframes ink-ripple-1 {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ink-ripple-1 {
          animation: ink-ripple-1 2.5s ease-out infinite;
        }
        @keyframes ink-ripple-2 {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ink-ripple-2 {
          animation: ink-ripple-2 2.5s ease-out infinite 0.5s;
        }
        @keyframes ink-ripple-3 {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ink-ripple-3 {
          animation: ink-ripple-3 2.5s ease-out infinite 1s;
        }
        @keyframes nian-spin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(90deg) scale(1.1);
          }
          50% {
            transform: rotate(180deg) scale(1);
          }
          75% {
            transform: rotate(270deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
        .animate-nian-spin {
          animation: nian-spin 3s linear infinite;
        }
        @keyframes brush-progress {
          0% {
            width: 0%;
            left: 0;
          }
          50% {
            width: 70%;
            left: 0;
          }
          100% {
            width: 30%;
            left: 100%;
          }
        }
        .animate-brush-progress {
          animation: brush-progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AILoader;
