import React from 'react';
import { useAppState } from '../hooks/useAppState';
import Button from '../components/Button';
import Card from '../components/Card';

const BudgetView: React.FC = () => {
  const { setView } = useAppState();

  const budgetItems = [
    { category: '设计费', amount: 5000, percentage: 5 },
    { category: '拆改工程', amount: 10000, percentage: 10 },
    { category: '水电改造', amount: 15000, percentage: 15 },
    { category: '泥瓦工程', amount: 20000, percentage: 20 },
    { category: '木工工程', amount: 18000, percentage: 18 },
    { category: '油漆工程', amount: 8000, percentage: 8 },
    { category: '安装工程', amount: 12000, percentage: 12 },
    { category: '软装家具', amount: 12000, percentage: 12 },
  ];

  const totalBudget = 100000;

  return (
    <div className="flex-1 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-title text-mo-black">预算管理</h1>
          <Button variant="text" onClick={() => setView('onboarding')}>
            返回首页
          </Button>
        </div>
        <Card type="success" title="总预算">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-dai-blue">¥{totalBudget.toLocaleString()}</p>
              <p className="text-helper text-fu-gray mt-1">整体预算健康度良好</p>
            </div>
            <div className="text-right">
              <p className="text-helper text-fu-gray">已使用</p>
              <p className="text-module-title font-semibold text-mo-black">65%</p>
            </div>
          </div>
        </Card>
        <div className="mt-6 space-y-3">
          {budgetItems.map((item, index) => (
            <Card key={index} type="info" title={item.category}>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="w-full bg-mi-white rounded-full h-2">
                    <div
                      className="bg-dai-blue h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <p className="text-module-title font-semibold text-mo-black whitespace-nowrap">
                  ¥{item.amount.toLocaleString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex gap-4 justify-center">
          <Button variant="secondary" onClick={() => setView('sop')}>
            返回SOP
          </Button>
          <Button variant="primary" onClick={() => setView('nian')}>
            找年兽聊聊
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetView;
