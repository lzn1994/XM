import React, { useState, useEffect } from 'react';
import AILoader from './AILoader';
import Button from '../Button';

interface FloorPlanRecognitionProps {
  onComplete: () => void;
  onClose: () => void;
}

type FloorPlanState = 'uploading' | 'analyzing' | 'result';

export const FloorPlanRecognition: React.FC<FloorPlanRecognitionProps> = ({ onComplete, onClose }) => {
  const [state, setState] = useState<FloorPlanState>('uploading');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (state === 'uploading') {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setState('analyzing');
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'analyzing') {
      const timer = setTimeout(() => {
        setState('result');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const rooms = [
    { name: '主卧', area: '18㎡' },
    { name: '次卧', area: '12㎡' },
    { name: '书房', area: '10㎡' },
    { name: '客厅', area: '25㎡' },
    { name: '厨房', area: '8㎡' },
    { name: '卫生间', area: '5㎡' },
    { name: '阳台', area: '4㎡' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-nuan-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-modal-in">
        <div className="bg-gradient-to-r from-dai-blue to-zhu-green p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏠</span>
              <div>
                <h3 className="text-lg font-bold">AI户型识别</h3>
                <p className="text-sm opacity-90">智能识别户型结构</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {state === 'uploading' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 mb-6 rounded-xl bg-mi-white flex items-center justify-center text-4xl animate-bounce-slow">
                📄
              </div>
              <p className="text-body text-mo-black font-medium mb-4">正在上传户型图...</p>
              <div className="w-full max-w-xs">
                <div className="h-3 bg-mi-white rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-dai-blue to-zhu-green rounded-full transition-all duration-100"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-helper text-fu-gray">{uploadProgress}%</p>
              </div>
            </div>
          )}

          {state === 'analyzing' && (
            <AILoader text="AI正在识别户型结构..." />
          )}

          {state === 'result' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zhu-green/10 text-zhu-green rounded-full text-helper font-medium">
                  <span>✓</span>
                  <span>户型识别完成</span>
                </div>
              </div>

              <div className="bg-mi-white rounded-xl p-4 mb-5">
                <div className="relative w-full h-48 bg-nuan-white rounded-lg border-2 border-dashed border-dai-blue/30">
                  <svg viewBox="0 0 200 150" className="w-full h-full p-4">
                    <rect x="10" y="10" width="80" height="60" fill="none" stroke="#4A6FA5" strokeWidth="2" rx="2" />
                    <text x="50" y="45" textAnchor="middle" fontSize="10" fill="#4A6FA5">客厅 25㎡</text>
                    
                    <rect x="100" y="10" width="50" height="40" fill="none" stroke="#5B8C5A" strokeWidth="2" rx="2" />
                    <text x="125" y="35" textAnchor="middle" fontSize="9" fill="#5B8C5A">主卧 18㎡</text>
                    
                    <rect x="160" y="10" width="30" height="40" fill="none" stroke="#8B6F47" strokeWidth="2" rx="2" />
                    <text x="175" y="35" textAnchor="middle" fontSize="8" fill="#8B6F47">次卧 12㎡</text>
                    
                    <rect x="100" y="60" width="40" height="35" fill="none" stroke="#C84A3E" strokeWidth="2" rx="2" />
                    <text x="120" y="82" textAnchor="middle" fontSize="8" fill="#C84A3E">书房 10㎡</text>
                    
                    <rect x="10" y="80" width="40" height="30" fill="none" stroke="#4A6FA5" strokeWidth="2" rx="2" />
                    <text x="30" y="100" textAnchor="middle" fontSize="8" fill="#4A6FA5">厨房 8㎡</text>
                    
                    <rect x="60" y="80" width="30" height="30" fill="none" stroke="#8B6F47" strokeWidth="2" rx="2" />
                    <text x="75" y="100" textAnchor="middle" fontSize="7" fill="#8B6F47">卫 5㎡</text>
                    
                    <rect x="150" y="60" width="40" height="50" fill="none" stroke="#5B8C5A" strokeWidth="2" rx="2" />
                    <text x="170" y="90" textAnchor="middle" fontSize="8" fill="#5B8C5A">阳台 4㎡</text>
                    
                    <line x1="50" y1="70" x2="50" y2="80" stroke="#2C2C2C" strokeWidth="1.5" />
                    <line x1="90" y1="40" x2="100" y2="40" stroke="#2C2C2C" strokeWidth="1.5" />
                    <line x1="140" y1="30" x2="160" y2="30" stroke="#2C2C2C" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-mi-white rounded-lg p-3 text-center">
                  <p className="text-helper text-fu-gray mb-1">户型</p>
                  <p className="text-module-title font-bold text-mo-black">3室2厅1厨1卫</p>
                </div>
                <div className="bg-mi-white rounded-lg p-3 text-center">
                  <p className="text-helper text-fu-gray mb-1">朝向</p>
                  <p className="text-module-title font-bold text-mo-black">朝南 ☀️</p>
                </div>
                <div className="bg-mi-white rounded-lg p-3 text-center">
                  <p className="text-helper text-fu-gray mb-1">建筑面积</p>
                  <p className="text-module-title font-bold text-dai-blue">100㎡</p>
                </div>
                <div className="bg-mi-white rounded-lg p-3 text-center">
                  <p className="text-helper text-fu-gray mb-1">套内面积</p>
                  <p className="text-module-title font-bold text-zhu-green">82㎡</p>
                </div>
              </div>

              <div className="bg-mi-white rounded-lg p-4 mb-6">
                <h4 className="text-body font-semibold text-mo-black mb-3">房间明细</h4>
                <div className="space-y-2">
                  {rooms.map((room, index) => (
                    <div key={index} className="flex items-center justify-between py-1.5 border-b border-fu-gray/10 last:border-0">
                      <span className="text-body text-mo-black">{room.name}</span>
                      <span className="text-body font-medium text-dai-blue">{room.area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="large"
                className="w-full py-3"
                onClick={onComplete}
              >
                确认数据
              </Button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes modal-in {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .animate-modal-in {
            animation: modal-in 0.3s ease-out;
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.4s ease-out;
          }
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default FloorPlanRecognition;
