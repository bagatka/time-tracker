import { Component, OnInit } from '@angular/core';
import { TrackingDataService, Task } from './services/tracking-data.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { interval } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ManualDataDialogComponent } from './components/manual-data-dialog/manual-data-dialog.component';
import { IndicatorLineComponent, Prize } from './components/indicator-line/indicator-line.component';
import { BalanceService } from './services/balance.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    DatePipe,
    IndicatorLineComponent
  ],
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['id', 'taskId', 'timeTracked', 'createdAt', 'updatedAt'];
  currentTask: any = null;
  timer: any;
  elapsedSeconds: number = 0;
  dailyTrackedTime: string = '00:00:00';
  dailyGoalSeconds: number = 23400; // Default 6.5 hours
  goalProgress: number = 0;
  searchText: string = '';
  prizeList: Prize[] = [
    { name: 'Prize 0', collectableAtValue: 5, starsValue: 1 },
    { name: 'Prize 1', collectableAtValue: 25, starsValue: 1 },
    { name: 'Prize 2', collectableAtValue: 50, starsValue: 2 },
    { name: 'Prize 3', collectableAtValue: 75, starsValue: 1 },
    { name: 'Prize 4', collectableAtValue: 100, starsValue: 5 }
  ];
  balance = 0;

  constructor(
    private readonly trackingDataService: TrackingDataService,
    private readonly balanceService: BalanceService,
    public readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.currentTask = this.trackingDataService.getCurrentTask();
    if (this.currentTask) {
      this.startTimer();
    }
    this.updateDailyTrackedTime();
    this.dailyGoalSeconds = this.trackingDataService.getDailyGoal();
    this.updateBalance();
  }

  updateBalance(): void {
    this.balance = this.balanceService.getBalance();
  }

  loadTasks(): void {
    this.tasks = this.trackingDataService.getTasks();
    this.sortTasks();
  }

  openTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent);

    dialogRef.afterClosed().subscribe((taskId) => {
      if (taskId) {
        this.trackingDataService.startTask(taskId);
        this.currentTask = this.trackingDataService.getCurrentTask();
        this.startTimer();
      }
    });
  }

  openManualDataDialog(): void {
    const dialogRef = this.dialog.open(ManualDataDialogComponent);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const { taskId, timeMinutes } = data;
        this.trackingDataService.addManualData(taskId, timeMinutes);
        this.updateDailyTrackedTime();
        this.loadTasks();
      }
    });
  }

  startTimer(): void {
    const startTime = new Date(this.currentTask.startTime).getTime();
    this.timer = interval(1000).subscribe(() => {
      this.elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    });
  }

  stopTask(): void {
    this.trackingDataService.stopTask();
    this.timer.unsubscribe();
    this.elapsedSeconds = 0;
    this.currentTask = null;
    this.updateDailyTrackedTime();
    this.loadTasks();
  }

  formatTime(totalSeconds: number): string {
    return this.trackingDataService.formatTime(totalSeconds);
  }

  updateDailyTrackedTime(): void {
    const dailySeconds = this.trackingDataService.getDailyTrackedSeconds();
    this.dailyTrackedTime = this.formatTime(dailySeconds);
    this.goalProgress = (dailySeconds / this.dailyGoalSeconds) * 100;
  }

  sortTasks(): void {
    this.tasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  setDailyGoal(): void {
    const currentDailyGoalSeconds = this.trackingDataService.getDailyGoal();
    const currentDailyGoalHours = currentDailyGoalSeconds / 3600;
    const hours = prompt('Enter daily goal in hours:', currentDailyGoalHours.toString());
    if (hours) {
      this.dailyGoalSeconds = parseFloat(hours) * 3600;
      this.trackingDataService.setDailyGoal(this.dailyGoalSeconds);
      this.updateDailyTrackedTime();
    }
  }
}
