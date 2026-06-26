import React, { useState, useEffect } from 'react';
import AILoader from './AILoader';
import Button from '../Button';

interface QualityInspectionProps {
  stepId: number;
  onComplete: (passed: boolean) => void;
  onClose: () => void;
}

type QualityState = 'uploading' | 'detecting' | 'result';

interface InspectionItem {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  detail?: string;
}

const inspectionConfig: Record<number, { title: string; items: InspectionItem[]; overall: 'pass' | 'warning' | 'fail' }> = {
  10: {
    title: '水电验收',
    overall: 'pass',
    items: [
      { name: '电路布线', status: 'pass', detail: '横平竖直，强弱电分离规范' },
      { name: '水管打压', status: 'pass', detail: '打压0.8MPa，30分钟无压降' },
      { name: '防水闭水', status: 'pass', detail: '48小时闭水试验无渗漏' },
      { name: '插座相位', status: 'pass', detail: '全部插座相位正确' },
    ],
  },
  12: {
    title: '防水处理',
    overall: 'pass',
    items: [
      { name: '防水层厚度', status: 'pass', detail: '平均厚度1.5mm，符合标准' },
      { name: '闭水试验', status: 'pass', detail: '48小时闭水，楼下无渗漏' },
      { name: '阴阳角处理', status: 'warning', detail: '局部阴阳角圆角不够圆润' },
    ],
  },
  13: {
    title: '贴砖工程',
    overall: 'warning',
    items: [
      { name: '空鼓率', status: 'warning', detail: '空鼓率约5%，建议局部整改' },
      { name: '平整度', status: 'pass', detail: '平整度误差小于2mm' },
      { name: '勾缝饱满度', status: 'pass', detail: '勾缝饱满，无遗漏' },
    ],
  },
  15: {
    title: '墙面刷漆',
    overall: 'pass',
    items: [
      { name: '墙面平整度', status: 'pass', detail: '平整度误差小于1mm' },
      { name: '色差', status: 'pass', detail: '颜色均匀，无色差' },
      { name: '阴阳角顺直', status: 'pass', detail: '阴阳角顺直，线条清晰' },
    ],
  },
};

export const QualityInspection: React.FC<QualityInspectionProps> = ({ stepId, onComplete, onClose }) => {
  const [state, setState] = useState<QualityState>('uploading');
  const [uploadedPhotos, setUploadedPhotos] = useState(0);

  const config = inspectionConfig[stepId] || inspectionConfig[10];
  const totalPhotos = 3;

  useEffect(() => {
    if (state === 'uploading') {
      const timers: NodeJS.Timeout[] = [];
      for (let i = 0; i < totalPhotos; i++) {
        const timer = setTimeout(() => {
          setUploadedPhotos(i + 1);
        }, (i + 1) * 600);
        timers.push(timer);
      }
      const finalTimer = setTimeout(() => {
        setState('detecting');
      }, totalPhotos * 600 + 300);
      timers.push(finalTimer);
      return () => timers.forEach(clearTimeout);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'detecting') {
      const timer = setTimeout(() => {
        setState('result');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'fail':
        return '❌';
    }
  };

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'text-zhu-green';
      case 'warning':
        return 'text-orange-500';
      case 'fail':
        return 'text-zhu-red';
    }
  };

  const getOverallText = () => {
    switch (config.overall) {
      case 'pass':
        return '合格';
      case 'warning':
        return '有小问题';
      case 'fail':
        return '不合格';
    }
  };

  const getOverallBgColor = () => {
    switch (config.overall) {
      case 'pass':
        return 'bg-zhu-green/10 text-zhu-green';
      case 'warning':
        return 'bg-orange-100 text-orange-700';
      case 'fail':
        return 'bg-zhu-red/10 text-zhu-red';
    }
  };

  const photoIcons = ['🔌', '💧', '📐'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-nuan-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-modal-in">
        <div className="bg-gradient-to-r from-zhu-green to-dai-blue p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔍</span>
              <div>
                <h3 className="text-lg font-bold">AI施工质检</h3>
                <p className="text-sm opacity-90">{config.title}质量检测</p>
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
              <p className="text-body text-mo-black font-medium mb-5">正在上传施工照片...</p>
              <div className="flex gap-4 mb-5">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 rounded-xl flex items-center justify-center text-3xl transition-all duration-300 ${
                      uploadedPhotos > index
                        ? 'bg-mi-white border-2 border-zhu-green scale-100 opacity-100'
                        : 'bg-fu-gray/10 border-2 border-dashed border-fu-gray/30 scale-90 opacity-50'
                    }`}
                  >
                    {uploadedPhotos > index ? photoIcons[index] : '📷'}
                  </div>
                ))}
              </div>
              <p className="text-helper text-fu-gray">
                {uploadedPhotos} / {totalPhotos} 张
              </p>
            </div>
          )}

          {state === 'detecting' && (
            <AILoader text="AI正在检测施工质量..." />
          )}

          {state === 'result' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-5">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-helper font-medium ${getOverallBgColor()}`}>
                  <span className="text-lg">{config.overall === 'pass' ? '✅' : config.overall === 'warning' ? '⚠️' : '❌'}</span>
                  <span>总体结果：{getOverallText()}</span>
                </div>
              </div>

              <div className="bg-mi-white rounded-lg p-4 mb-5">
                <h4 className="text-body font-semibold text-mo-black mb-4">检测项明细</h4>
                <div className="space-y-3">
                  {config.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 pb-3 border-b border-fu-gray/10 last:border-0 last:pb-0"
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{getStatusIcon(item.status)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-body font-medium text-mo-black">{item.name}</span>
                          <span className={`text-helper font-medium ${getStatusColor(item.status)}`}>
                            {item.status === 'pass' ? '合格' : item.status === 'warning' ? '注意' : '不合格'}
                          </span>
                        </div>
                        {item.detail && (
                          <p className="text-helper text-fu-gray">{item.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {config.overall !== 'fail' ? (
                  <>
                    <Button
                      variant="primary"
                      size="large"
                      className="flex-1 py-3"
                      onClick={() => onComplete(true)}
                    >
                      验收通过，下一步
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    size="large"
                    className="flex-1 py-3"
                    onClick={() => onComplete(false)}
                  >
                    需要整改
                  </Button>
                )}
                {config.overall === 'warning' && (
                  <Button
                    variant="secondary"
                    size="large"
                    className="flex-1 py-3"
                    onClick={() => onComplete(false)}
                  >
                    需要整改
                  </Button>
                )}
              </div>
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
        `}</style>
      </div>
    </div>
  );
};

export default QualityInspection;
