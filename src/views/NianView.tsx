import React from 'react';
import { useAppState } from '../hooks/useAppState';
import Button from '../components/Button';
import Card from '../components/Card';
import NianAvatar from '../components/NianAvatar';

const NianView: React.FC = () => {
  const { state, setView } = useAppState();

  return (
    <div className="flex-1 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-title text-mo-black">年兽陪伴</h1>
          <Button variant="text" onClick={() => setView('onboarding')}>
            返回首页
          </Button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <NianAvatar size={120} />
          <h2 className="text-module-title font-semibold text-mo-black mt-4">
            年年 Lv.{state.nianProgress.level}
          </h2>
          <p className="text-helper text-fu-gray mt-1">
            经验值：{state.nianProgress.experience} / {state.nianProgress.level * 100}
          </p>
          <div className="w-64 bg-mi-white rounded-full h-2 mt-2">
            <div
              className="bg-zhu-red h-2 rounded-full"
              style={{
                width: `${(state.nianProgress.experience / (state.nianProgress.level * 100)) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card type="info" title="每日签到">
            <p className="text-body text-mo-black mb-3">每天来看看年兽，获得经验值！</p>
            <Button variant="primary" size="small">
              立即签到
            </Button>
          </Card>
          <Card type="success" title="装修进度">
            <p className="text-body text-mo-black mb-3">完成装修步骤，年兽也会成长！</p>
            <Button variant="secondary" size="small" onClick={() => setView('sop')}>
              去做任务
            </Button>
          </Card>
          <Card type="warn" title="年兽徽章">
            <p className="text-body text-mo-black mb-3">
              已解锁 {state.nianProgress.unlockedBadges.length} 个徽章
            </p>
            <div className="flex gap-2 text-2xl">
              🏠 🎨 🔨
            </div>
          </Card>
          <Card type="info" title="年兽商店">
            <p className="text-body text-mo-black mb-3">用经验值兑换年兽装扮！</p>
            <Button variant="text" size="small">
              敬请期待
            </Button>
          </Card>
        </div>
        <div className="mt-6 flex gap-4 justify-center">
          <Button variant="secondary" onClick={() => setView('sop')}>
            返回SOP
          </Button>
          <Button variant="primary" onClick={() => setView('budget')}>
            查看预算
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NianView;
