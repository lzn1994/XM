import React, { useState, useEffect } from 'react';
import AILoader from './AILoader';
import Button from '../Button';

interface ContractReviewProps {
  onComplete: () => void;
}

type ContractState = 'scanning' | 'analyzing' | 'result';

export const ContractReview: React.FC<ContractReviewProps> = ({ onComplete }) => {
  const [state, setState] = useState<ContractState>('scanning');
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    if (state === 'scanning') {
      const interval = setInterval(() => {
        setScanPosition((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setState('analyzing');
            return 100;
          }
          return prev + 1;
        });
      }, 30);
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

  const risks = [
    {
      level: 'warning',
      title: '增项条款不明确',
      description: '"增项费用按实际发生结算"表述模糊，建议明确单价和上限',
    },
    {
      level: 'warning',
      title: '工期延误责任不对等',
      description: '施工方延误仅赔10元/天，业主延误赔50元/天',
    },
    {
      level: 'warning',
      title: '保修期限偏短',
      description: '水电保修仅2年，建议争取5年',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-nuan-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-modal-in">
        <div className="bg-gradient-to-r from-zhu-red to-tan-brown p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h3 className="text-lg font-bold">AI合同鉴别</h3>
              <p className="text-sm opacity-90">智能检测合同风险</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {state === 'scanning' && (
            <div className="py-4">
              <p className="text-center text-body text-mo-black font-medium mb-5">
                正在扫描合同条款...
              </p>
              <div className="relative bg-mi-white rounded-xl p-4 overflow-hidden h-64">
                <div
                  className="absolute left-0 right-0 h-0.5 bg-zhu-red/60 z-10"
                  style={{ top: `${scanPosition}%`, boxShadow: '0 0 10px rgba(200, 74, 62, 0.5)' }}
                />
                <div className="space-y-3">
                  <div className="h-3 bg-fu-gray/20 rounded w-3/4" />
                  <div className="h-3 bg-fu-gray/20 rounded w-full" />
                  <div className="h-3 bg-fu-gray/20 rounded w-5/6" />
                  <div className="h-3 bg-fu-gray/20 rounded w-2/3" />
                  <div className="h-3 bg-fu-gray/20 rounded w-full" />
                  <div className="h-3 bg-fu-gray/20 rounded w-4/5" />
                  <div className="h-3 bg-fu-gray/20 rounded w-3/4" />
                  <div className="h-3 bg-fu-gray/20 rounded w-full" />
                  <div className="h-3 bg-fu-gray/20 rounded w-5/6" />
                  <div className="h-3 bg-fu-gray/20 rounded w-2/3" />
                  <div className="h-3 bg-fu-gray/20 rounded w-full" />
                  <div className="h-3 bg-fu-gray/20 rounded w-4/5" />
                  <div className="h-3 bg-fu-gray/20 rounded w-3/4" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-48 h-2 bg-mi-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zhu-red rounded-full transition-all duration-100"
                    style={{ width: `${scanPosition}%` }}
                  />
                </div>
                <span className="text-helper text-fu-gray">{Math.round(scanPosition)}%</span>
              </div>
            </div>
          )}

          {state === 'analyzing' && (
            <AILoader text="AI正在分析合同风险..." />
          )}

          {state === 'result' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-helper font-medium">
                  <span className="text-lg">⚠️</span>
                  <span>B级 - 有3处需注意</span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {risks.map((risk, index) => (
                  <div
                    key={index}
                    className="bg-mi-white rounded-lg p-4 border-l-4 border-orange-400"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">⚠️</span>
                      <div>
                        <h4 className="text-body font-semibold text-mo-black mb-1">
                          {index + 1}. {risk.title}
                        </h4>
                        <p className="text-helper text-fu-gray leading-relaxed">
                          {risk.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-tan-brown/10 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <div>
                    <h4 className="text-body font-semibold text-tan-brown mb-1">AI建议</h4>
                    <p className="text-helper text-tan-brown/80 leading-relaxed">
                      建议与装修公司协商修改以上条款后再签约，以保障您的合法权益。
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="large"
                className="w-full py-3"
                onClick={onComplete}
              >
                我知道了，继续
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
        `}</style>
      </div>
    </div>
  );
};

export default ContractReview;
