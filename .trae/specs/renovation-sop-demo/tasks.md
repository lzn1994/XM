# 我的宝贝房子 DEMO - 实施计划（分解与优先级任务列表）

## [x] Task 1: 项目脚手架与设计系统搭建
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 初始化 React + Vite + TypeScript + Tailwind CSS 项目
  - 配置设计系统 CSS 变量（色彩/字体/间距/圆角/阴影）
  - 创建公共基础组件：Button（主/次/文字按钮）、Card（信息/警告/成功）、NianAvatar（年兽头像）
  - 创建全局状态管理（React Context + useReducer）
  - 配置 localStorage 持久化
  - 配置路由/视图状态机
- **Acceptance Criteria Addressed**: AC-16, AC-15
- **Test Requirements**:
  - `programmatic` TR-1.1: 项目能正常构建和启动
  - `programmatic` TR-1.2: 所有设计 token 以 CSS 变量定义，可在浏览器控制台查看
  - `programmatic` TR-1.3: 状态变更后刷新页面，数据从 localStorage 恢复
  - `human-judgement` TR-1.4: 基础组件样式符合新中式扁平卡通设计规范
- **Notes**: 使用 Vite 作为构建工具，Tailwind CSS 使用 CSS 变量主题配置

## [x] Task 2: 数据层与预置数据
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 创建风格探测题目配置数据（5题完整内容+权重映射）
  - 创建 SOP 20步数据（6大阶段、每步操作指引、检查清单）
  - 创建预算数据（532拆解规则、6阶段释放比例、主材品类预算）
  - 创建年兽成长数据（5级装备、6阶段房子家具、情绪状态）
  - 创建演示模式 Mock 数据
  - 定义 TypeScript 类型接口
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-7
- **Test Requirements**:
  - `programmatic` TR-2.1: 所有数据模块有完整 TypeScript 类型定义
  - `programmatic` TR-2.2: 风格探测权重计算逻辑可导出并测试
  - `programmatic` TR-2.3: 预算拆解计算逻辑可导出并测试
- **Notes**: 数据与视图分离，便于后续替换为真实 API

## [x] Task 3: 对话流风格探测与需求采集视图
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 实现全屏对话界面（米白背景、年兽头像、消息气泡）
  - 实现5题渐进式披露交互（4图选择/单选/二选一）
  - 实现风格结果计算与展示卡片
  - 实现基础信息采集（预算/城市/面积/特殊需求）
  - 实现 AI 户型图识别模拟（上传动画+水墨晕染加载+识别结果）
  - 实现年兽阶段性情感反馈
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-4, AC-16
- **Test Requirements**:
  - `programmatic` TR-3.1: 5道题可按顺序完成，结果正确计算
  - `programmatic` TR-3.2: 基础信息采集各项数据正确存入全局状态
  - `programmatic` TR-3.3: 户型识别模拟动画完整播放后自动进入下一步
  - `human-judgement` TR-3.4: 对话气泡动画流畅，年兽表情生动
- **Notes**: 消息气泡带淡入+弹跳动画，选项有 hover 效果

## [x] Task 4: SOP 流程视图与时间线
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 实现左侧垂直时间线（20步进度，竹青/黛蓝/灰三态）
  - 实现右侧步骤详情卡片（标题/指引/检查清单/完成按钮）
  - 实现强制解锁逻辑（只能进入下一步，不可跳步）
  - 实现每步五步闭环（年兽引导→操作指引→AI辅助→完成确认→反馈）
  - 实现主材采购提醒提示
  - 实现现代中式施工注意点提示
- **Acceptance Criteria Addressed**: AC-3, AC-16
- **Test Requirements**:
  - `programmatic` TR-4.1: 完成当前步骤后才能解锁下一步，不可跳过
  - `programmatic` TR-4.2: 步骤状态（已完成/进行中/锁定）视觉区分正确
  - `programmatic` TR-4.3: 完成步骤后年兽等级和灵气值正确增加
  - `human-judgement` TR-4.4: 时间线脉冲动画流畅，步骤卡片布局清晰
- **Notes**: PC端左侧时间线+右侧详情，移动端折叠为顶部进度条

## [/] Task 5: AI 功能模拟模块
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - AI 户型识别：上传动画→水墨晕染加载→识别结果展示
  - AI 合同鉴别：模拟扫描动画→风险检测结果→建议（强制触发）
  - AI 施工质检：预置照片展示→模拟检测报告→验收结果（4个节点）
  - 统一 AI 加载动画组件（水墨晕染效果）
  - 与 SOP 步骤触发点集成
- **Acceptance Criteria Addressed**: AC-4, AC-5, AC-6
- **Test Requirements**:
  - `programmatic` TR-5.1: 合同鉴别不完成无法继续SOP步骤
  - `programmatic` TR-5.2: 4个质检节点在对应步骤自动触发
  - `human-judgement` TR-5.3: AI 动画有科技感且符合中式美学
- **Notes**: 全部使用 CSS 动画 + GSAP 实现，Canvas 用于水墨粒子效果

## [ ] Task 6: 预算管理视图
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 实现铜钱形状进度环（SVG实现，中心年兽表情）
  - 实现预算健康度三态切换（健康/预警/危险）
  - 实现阶段预算卡片网格（6阶段进度条+金额+状态）
  - 实现主材采购列表（分类Tab+产品卡片+状态徽章）
  - 实现增项预警弹窗
  - 实现与SOP联动的预算释放逻辑
- **Acceptance Criteria Addressed**: AC-7, AC-8, AC-9, AC-12
- **Test Requirements**:
  - `programmatic` TR-6.1: 总预算按532原则正确拆解
  - `programmatic` TR-6.2: 城市系数正确应用（一线+15%/二三线-10%）
  - `programmatic` TR-6.3: 完成SOP阶段后对应预算池解锁
  - `programmatic` TR-6.4: 预算执行率超过阈值触发对应健康状态
  - `human-judgement` TR-6.5: 铜钱进度环视觉美观，状态颜色区分明显
- **Notes**: 铜钱进度环使用 SVG stroke-dasharray 实现分段进度

## [ ] Task 7: 年兽养成视图
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 实现中式房子场景（6阶段进化，CSS+Canvas实现）
  - 实现年兽角色展示（5级成长外观变化）
  - 实现年兽情绪系统（开心/打盹/困惑三种表情动画）
  - 实现年兽互动（点击作揖、长按查看属性面板）
  - 实现底部Tab导航（房子/任务/背包/设置）
  - 实现装备展示与成长数值面板
- **Acceptance Criteria Addressed**: AC-10, AC-11, AC-12, AC-16
- **Test Requirements**:
  - `programmatic` TR-7.1: 年兽等级随SOP步骤完成正确提升
  - `programmatic` TR-7.2: 房子阶段随SOP阶段完成正确进化
  - `programmatic` TR-7.3: 预算状态变化时年兽情绪正确切换
  - `human-judgement` TR-7.4: 年兽动画生动可爱，房子场景有中式韵味
- **Notes**: 优先用CSS动画实现年兽，复杂粒子用Canvas

## [ ] Task 8: 演示模式
- **Priority**: medium
- **Depends On**: Task 3, Task 4, Task 5, Task 6, Task 7
- **Description**:
  - 实现右下角浮动演示入口球
  - 实现6章演示脚本自动播放控制
  - 实现 Spotlight 高亮 + 解说 Tooltip
  - 实现顶部进度条与章节标签
  - 实现演示与正常模式数据隔离
  - 实现演示结束后保留数据供探索
- **Acceptance Criteria Addressed**: AC-13
- **Test Requirements**:
  - `programmatic` TR-8.1: 点击演示按钮后4分钟内完成全部6章
  - `programmatic` TR-8.2: 每章有对应 Spotlight 高亮和解说文字
  - `programmatic` TR-8.3: 演示过程中用户输入被拦截
  - `human-judgement` TR-8.4: 演示节奏流畅，解说与画面同步
- **Notes**: 使用 DemoActor 类封装演示逻辑，与业务逻辑解耦

## [ ] Task 9: 全局导航与响应式适配
- **Priority**: medium
- **Depends On**: Task 3, Task 4, Task 6, Task 7
- **Description**:
  - 实现PC端左侧垂直导航栏
  - 实现移动端底部Tab导航栏
  - 实现视图切换过渡动画
  - 适配平板（768-1024px）顶部Tab导航
  - 各视图响应式布局调整
- **Acceptance Criteria Addressed**: AC-14, AC-16
- **Test Requirements**:
  - `programmatic` TR-9.1: 三种断点下导航布局正确切换
  - `programmatic` TR-9.2: 视图切换动画 < 300ms
  - `human-judgement` TR-9.3: 各断点下内容布局合理，无溢出或重叠
- **Notes**: 使用 Tailwind 响应式断点，移动优先

## [ ] Task 10: 动画与交互优化
- **Priority**: medium
- **Depends On**: Task 3, Task 4, Task 5, Task 6, Task 7
- **Description**:
  - 实现水墨拖尾粒子效果（Canvas）
  - 实现墨滴扩散完成动画
  - 实现铜钱旋转解锁动画
  - 实现昼夜切换过渡效果
  - 实现步骤解锁水墨粒子爆发
  - 实现空状态/加载状态/异常状态/成功状态页面
- **Acceptance Criteria Addressed**: AC-16
- **Test Requirements**:
  - `programmatic` TR-10.1: 关键动画在PC端60fps流畅运行
  - `programmatic` TR-10.2: 移动端水墨粒子降级为CSS动画
  - `human-judgement` TR-10.3: 动画风格统一，符合中式美学
- **Notes**: 使用 GSAP 管理复杂动画时序，requestAnimationFrame 做 Canvas 粒子

## [ ] Task 11: 整体联调与体验优化
- **Priority**: high
- **Depends On**: Task 8, Task 9, Task 10
- **Description**:
  - 端到端流程测试（风格探测→SOP→预算→年兽）
  - 5分钟闭环体验流畅度验证
  - 数据一致性检查（SOP进度↔预算↔年兽成长）
  - localStorage 持久化验证
  - 性能优化（首屏加载 < 2s）
  - 修复发现的 Bug
- **Acceptance Criteria Addressed**: AC-15, AC-16, NFR-1, NFR-6
- **Test Requirements**:
  - `programmatic` TR-11.1: 从风格探测到SOP步骤3完成 < 5分钟
  - `programmatic` TR-11.2: 首屏加载时间 < 2秒
  - `programmatic` TR-11.3: 刷新页面后所有进度数据正确恢复
  - `human-judgement` TR-11.4: 整体体验流畅，无明显卡顿或Bug
- **Notes**: 这是集成测试阶段，确保各模块协同工作
