import { demoChapters, totalDemoDuration } from './demo-script';
import type { DemoChapter, DemoBeat, DemoSpotlight, DemoNarration } from './demo-script';
import type { ViewType } from '../hooks/useAppState';

export type DemoActorStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface DemoActorState {
  status: DemoActorStatus;
  currentChapterIndex: number;
  currentBeatIndex: number;
  overallProgress: number;
  chapterProgress: number;
  beatProgress: number;
  currentChapter: DemoChapter | null;
  currentBeat: DemoBeat | null;
  spotlight: DemoSpotlight | null;
  narration: DemoNarration | null;
  elapsedTime: number;
}

export interface DemoActorCallbacks {
  onStateChange?: (state: DemoActorState) => void;
  onNavigate?: (view: ViewType) => void;
  onDispatch?: (action: any) => void;
  onComplete?: () => void;
  onChapterChange?: (chapter: DemoChapter) => void;
}

export class DemoActor {
  private state: DemoActorState;
  private callbacks: DemoActorCallbacks;
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private beatStartTime: number = 0;
  private chapterStartTime: number = 0;
  private pausedElapsed: number = 0;
  private pausedAt: number = 0;

  constructor(callbacks: DemoActorCallbacks = {}) {
    this.callbacks = callbacks;
    this.state = {
      status: 'idle',
      currentChapterIndex: 0,
      currentBeatIndex: 0,
      overallProgress: 0,
      chapterProgress: 0,
      beatProgress: 0,
      currentChapter: null,
      currentBeat: null,
      spotlight: null,
      narration: null,
      elapsedTime: 0,
    };
  }

  getState(): DemoActorState {
    return { ...this.state };
  }

  start(): void {
    if (this.state.status === 'playing') return;

    const wasPaused = this.state.status === 'paused';
    this.state.status = 'playing';

    if (!wasPaused) {
      this.state.currentChapterIndex = 0;
      this.state.currentBeatIndex = 0;
      this.state.overallProgress = 0;
      this.state.chapterProgress = 0;
      this.state.beatProgress = 0;
      this.state.elapsedTime = 0;
      this.pausedElapsed = 0;
      this.chapterStartTime = performance.now();
      this.beatStartTime = performance.now();
      this.updateCurrentBeat();
    } else {
      const now = performance.now();
      this.pausedElapsed += now - this.pausedAt;
    }

    this.lastTimestamp = performance.now();
    this.notifyStateChange();
    this.loop();
  }

  pause(): void {
    if (this.state.status !== 'playing') return;
    this.state.status = 'paused';
    this.pausedAt = performance.now();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.notifyStateChange();
  }

  resume(): void {
    if (this.state.status !== 'paused') return;
    this.start();
  }

  stop(): void {
    this.state.status = 'idle';
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.notifyStateChange();
  }

  skipChapter(): void {
    if (this.state.status !== 'playing' && this.state.status !== 'paused') return;

    const nextChapterIndex = this.state.currentChapterIndex + 1;
    if (nextChapterIndex >= demoChapters.length) {
      this.complete();
      return;
    }

    this.state.currentChapterIndex = nextChapterIndex;
    this.state.currentBeatIndex = 0;

    let elapsedBeforeChapter = 0;
    for (let i = 0; i < nextChapterIndex; i++) {
      elapsedBeforeChapter += demoChapters[i].duration;
    }

    this.state.elapsedTime = elapsedBeforeChapter;
    this.state.overallProgress = (elapsedBeforeChapter / totalDemoDuration) * 100;
    this.state.chapterProgress = 0;
    this.state.beatProgress = 0;

    this.chapterStartTime = performance.now() - this.pausedElapsed - elapsedBeforeChapter * 1000;
    this.beatStartTime = performance.now() - this.pausedElapsed;

    this.updateCurrentBeat();
    this.notifyStateChange();

    if (this.state.status === 'paused') {
      this.start();
    }
  }

  skipBeat(): void {
    if (this.state.status !== 'playing' && this.state.status !== 'paused') return;

    const currentChapter = demoChapters[this.state.currentChapterIndex];
    if (!currentChapter) return;

    const nextBeatIndex = this.state.currentBeatIndex + 1;

    if (nextBeatIndex >= currentChapter.beats.length) {
      this.skipChapter();
      return;
    }

    this.state.currentBeatIndex = nextBeatIndex;
    this.updateCurrentBeat();

    let beatElapsed = 0;
    for (let i = 0; i < nextBeatIndex; i++) {
      beatElapsed += currentChapter.beats[i].duration;
    }

    this.state.beatProgress = 0;
    this.state.chapterProgress = (beatElapsed / currentChapter.duration) * 100;

    let chapterElapsed = 0;
    for (let i = 0; i < this.state.currentChapterIndex; i++) {
      chapterElapsed += demoChapters[i].duration;
    }
    const overallElapsed = chapterElapsed + beatElapsed;
    this.state.overallProgress = (overallElapsed / totalDemoDuration) * 100;
    this.state.elapsedTime = overallElapsed;

    this.beatStartTime = performance.now() - this.pausedElapsed;
    this.notifyStateChange();
  }

  private complete(): void {
    this.state.status = 'completed';
    this.state.overallProgress = 100;
    this.state.chapterProgress = 100;
    this.state.beatProgress = 100;
    this.state.spotlight = null;
    this.state.narration = null;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.notifyStateChange();
    this.callbacks.onComplete?.();
  }

  private loop = (): void => {
    if (this.state.status !== 'playing') return;

    const now = performance.now();
    const effectiveNow = now - this.pausedElapsed;
    const deltaTime = (now - this.lastTimestamp) / 1000;
    this.lastTimestamp = now;

    const currentChapter = demoChapters[this.state.currentChapterIndex];
    const currentBeat = currentChapter?.beats[this.state.currentBeatIndex];

    if (!currentChapter || !currentBeat) {
      this.complete();
      return;
    }

    const chapterElapsed = (effectiveNow - this.chapterStartTime) / 1000;
    const beatElapsed = (effectiveNow - this.beatStartTime) / 1000;

    this.state.elapsedTime += deltaTime;
    this.state.overallProgress = Math.min(
      (this.state.elapsedTime / totalDemoDuration) * 100,
      100
    );
    this.state.chapterProgress = Math.min(
      (chapterElapsed / currentChapter.duration) * 100,
      100
    );
    this.state.beatProgress = Math.min(
      (beatElapsed / currentBeat.duration) * 100,
      100
    );

    if (beatElapsed >= currentBeat.duration) {
      this.advanceBeat();
    }

    this.notifyStateChange();
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private advanceBeat(): void {
    const currentChapter = demoChapters[this.state.currentChapterIndex];
    if (!currentChapter) return;

    const nextBeatIndex = this.state.currentBeatIndex + 1;

    if (nextBeatIndex >= currentChapter.beats.length) {
      this.advanceChapter();
      return;
    }

    this.state.currentBeatIndex = nextBeatIndex;
    this.beatStartTime = performance.now() - this.pausedElapsed;
    this.updateCurrentBeat();
  }

  private advanceChapter(): void {
    const nextChapterIndex = this.state.currentChapterIndex + 1;

    if (nextChapterIndex >= demoChapters.length) {
      this.complete();
      return;
    }

    this.state.currentChapterIndex = nextChapterIndex;
    this.state.currentBeatIndex = 0;
    this.chapterStartTime = performance.now() - this.pausedElapsed;
    this.beatStartTime = performance.now() - this.pausedElapsed;

    const nextChapter = demoChapters[nextChapterIndex];
    this.state.currentChapter = nextChapter;
    this.callbacks.onChapterChange?.(nextChapter);
    this.updateCurrentBeat();
  }

  private updateCurrentBeat(): void {
    const currentChapter = demoChapters[this.state.currentChapterIndex];
    const currentBeat = currentChapter?.beats[this.state.currentBeatIndex];

    this.state.currentChapter = currentChapter || null;
    this.state.currentBeat = currentBeat || null;
    this.state.spotlight = currentBeat?.spotlight || null;
    this.state.narration = currentBeat?.narration || null;

    if (currentBeat?.action) {
      this.executeAction(currentBeat.action);
    }
  }

  private executeAction(action: { type: string; payload?: any }): void {
    switch (action.type) {
      case 'navigate':
        this.callbacks.onNavigate?.(action.payload as ViewType);
        break;
      case 'dispatch':
        this.callbacks.onDispatch?.(action.payload);
        break;
    }
  }

  private notifyStateChange(): void {
    this.callbacks.onStateChange?.({ ...this.state });
  }

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  getTotalDuration(): number {
    return totalDemoDuration;
  }

  getChapters(): DemoChapter[] {
    return demoChapters;
  }
}
