import React, { useState } from 'react';
import Button from './Button';

interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: 'spirit' | 'jade';
  completed: boolean;
  icon: string;
}

interface AchievementTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: 'spirit' | 'jade' | 'badge';
  progress: number;
  total: number;
  icon: string;
  unlocked: boolean;
}

const dailyTasks: DailyTask[] = [
  { id: 'daily-1', title: '每日签到', description: '每天打开APP签到', reward: 20, rewardType: 'spirit', completed: false, icon: '📅' },
  { id: 'daily-2', title: '完成一个SOP步骤', description: '推进装修进度', reward: 100, rewardType: 'spirit', completed: false, icon: '✅' },
  { id: 'daily-3', title: '使用AI助手', description: '使用任意AI功能一次', reward: 10, rewardType: 'spirit', completed: false, icon: '🤖' },
  { id: 'daily-4', title: '查看预算', description: '检查预算健康度', reward: 5, rewardType: 'jade', completed: false, icon: '💰' },
];

const achievementTasks: AchievementTask[] = [
  { id: 'ach-1', title: '装修新手', description: '完成第一个装修步骤', reward: 50, rewardType: 'spirit', progress: 1, total: 1, icon: '🌱', unlocked: true },
  { id: 'ach-2', title: '精打细算', description: '预算节省超过10%', reward: 100, rewardType: 'jade', progress: 0, total: 10, icon: '💎', unlocked: false },
  { id: 'ach-3', title: '风雨无阻', description: '连续签到7天', reward: 200, rewardType: 'spirit', progress: 3, total: 7, icon: '🔥', unlocked: false },
  { id: 'ach-4', title: '半程达人', description: '完成10个装修步骤', reward: 300, rewardType: 'spirit', progress: 0, total: 10, icon: '🏗️', unlocked: false },
  { id: 'ach-5', title: '圆满竣工', description: '完成全部20个步骤', reward: 1000, rewardType: 'spirit', progress: 0, total: 20, icon: '🏆', unlocked: false },
  { id: 'ach-6', title: 'AI达人', description: '使用AI功能20次', reward: 150, rewardType: 'jade', progress: 5, total: 20, icon: '🤖', unlocked: false },
];

interface TasksTabProps {
  onClaim?: (taskId: string, reward: number, type: string) => void;
  className?: string;
}

export const TasksTab: React.FC<TasksTabProps> = ({ onClaim, className = '' }) => {
  const [tasks, setTasks] = useState(dailyTasks);
  const [achievements] = useState(achievementTasks);
  const [activeSection, setActiveSection] = useState<'daily' | 'achievement'>('daily');

  const handleClaimDaily = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)));
      onClaim?.(taskId, task.reward, task.rewardType);
    }
  };

  const completedDaily = tasks.filter((t) => t.completed).length;
  const totalDailyReward = tasks.reduce((sum, t) => sum + t.reward, 0);

  return (
    <div className={`${className}`}>
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeSection === 'daily'
              ? 'bg-dai-blue text-white'
              : 'bg-mi-white text-fu-gray hover:bg-nuan-white'
          }`}
          onClick={() => setActiveSection('daily')}
        >
          每日任务
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeSection === 'achievement'
              ? 'bg-dai-blue text-white'
              : 'bg-mi-white text-fu-gray hover:bg-nuan-white'
          }`}
          onClick={() => setActiveSection('achievement')}
        >
          成就任务
        </button>
      </div>

      {activeSection === 'daily' && (
        <div>
          <div className="bg-gradient-to-r from-zhu-red/10 to-tan-brown/10 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-mo-black">今日进度</span>
              <span className="text-helper text-fu-gray">
                {completedDaily}/{tasks.length} 已完成
              </span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-zhu-red to-tan-brown h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedDaily / tasks.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-fu-gray mt-2">
              全部完成可获得 {totalDailyReward} 灵气值奖励
            </p>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-nuan-white rounded-lg p-4 border transition-all ${
                  task.completed ? 'border-zhu-green/30 bg-zhu-green/5' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-mi-white flex items-center justify-center text-2xl">
                    {task.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-mo-black text-body">{task.title}</h4>
                    <p className="text-helper text-fu-gray mt-0.5">{task.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm">{task.rewardType === 'spirit' ? '✨' : '💎'}</span>
                      <span className="text-xs text-tan-brown font-medium">+{task.reward}</span>
                    </div>
                  </div>
                  <Button
                    variant={task.completed ? 'text' : 'primary'}
                    size="small"
                    onClick={() => handleClaimDaily(task.id)}
                    disabled={task.completed}
                  >
                    {task.completed ? '已领取' : '去完成'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'achievement' && (
        <div className="space-y-3">
          {achievements.map((ach) => {
            const progressPct = (ach.progress / ach.total) * 100;
            const isComplete = ach.progress >= ach.total;
            return (
              <div
                key={ach.id}
                className={`bg-nuan-white rounded-lg p-4 border transition-all ${
                  ach.unlocked || isComplete
                    ? 'border-transparent'
                    : 'border-transparent opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      isComplete ? 'bg-zhu-green/20' : 'bg-mi-white'
                    }`}
                  >
                    {ach.unlocked || isComplete ? ach.icon : '🔒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-mo-black text-body flex items-center gap-2">
                      {ach.title}
                      {isComplete && <span className="text-zhu-green">✓</span>}
                    </h4>
                    <p className="text-helper text-fu-gray mt-0.5">{ach.description}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-fu-gray">
                          {ach.progress}/{ach.total}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{ach.rewardType === 'spirit' ? '✨' : ach.rewardType === 'jade' ? '💎' : '🏅'}</span>
                          <span className="text-xs text-tan-brown font-medium">+{ach.reward}</span>
                        </div>
                      </div>
                      <div className="w-full bg-mi-white rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            isComplete ? 'bg-zhu-green' : 'bg-dai-blue'
                          }`}
                          style={{ width: `${Math.min(progressPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TasksTab;
