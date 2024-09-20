import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export interface Task {
  id: number;
  taskId: string;
  timeTracked: string;
  createdAt: string;
  updatedAt: string;
  totalSeconds: number;
}

@Injectable({
  providedIn: 'root',
})
export class TrackingDataService {
  private tasksKey = 'trackedTasks';
  private currentTaskKey = 'currentTask';
  private tasks: Task[] = [];
  private currentTask: any = null;
  private dailyGoalKey = 'dailyGoal';

  constructor(private localStorageService: LocalStorageService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.tasks = this.localStorageService.get(this.tasksKey) || [];
    this.currentTask = this.localStorageService.get(this.currentTaskKey);
  }

  getTasks(): Task[] {
    this.loadTasks();
    return this.tasks;
  }

  getCurrentTask(): any {
    return this.currentTask;
  }

  startTask(taskId: string): void {
    const startTime = new Date().toISOString();
    this.currentTask = { taskId, startTime };
    this.localStorageService.set(this.currentTaskKey, this.currentTask);
  }

  stopTask(): void {
    const endTime = new Date().toISOString();
    const durationSeconds = Math.floor(
      (new Date(endTime).getTime() - new Date(this.currentTask.startTime).getTime()) / 1000
    );

    let task = this.tasks.find((t) => t.taskId === this.currentTask.taskId);
    if (task) {
      task.totalSeconds += durationSeconds;
      task.timeTracked = this.formatTime(task.totalSeconds);
      task.updatedAt = new Date().toISOString();
    } else {
      task = {
        id: this.tasks.length + 1,
        taskId: this.currentTask.taskId,
        totalSeconds: durationSeconds,
        timeTracked: this.formatTime(durationSeconds),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.tasks.push(task);
    }

    this.localStorageService.set(this.tasksKey, this.tasks);
    this.currentTask = null;
    this.localStorageService.remove(this.currentTaskKey);
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  getDailyTrackedSeconds(): number {
    const today = new Date().toDateString();
    return this.tasks
      .filter((task) => new Date(task.updatedAt).toDateString() === today)
      .reduce((sum, task) => sum + task.totalSeconds, 0);
  }

  getDailyGoal(): number {
    return this.localStorageService.get(this.dailyGoalKey) || 23400; // Default 6.5 hours
  }

  setDailyGoal(seconds: number): void {
    this.localStorageService.set(this.dailyGoalKey, seconds);
  }
}
