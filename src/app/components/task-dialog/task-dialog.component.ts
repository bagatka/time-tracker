import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TrackingDataService } from '../../services/tracking-data.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class TaskDialogComponent {
  taskId: string = '';
  message: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trackingDataService: TrackingDataService
  ) {}
  checkTask(): void {
    const tasks = this.trackingDataService.getTasks();
    const task = tasks.find((t) => t.taskId === this.taskId);
    if (task) {
      this.message = `You have already logged ${task.timeTracked} on this task.`;
    } else {
      this.message = 'This is a new task.';
    }
  }
}
