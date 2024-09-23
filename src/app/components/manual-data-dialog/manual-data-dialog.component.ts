import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrackingDataService } from '../../services/tracking-data.service';

@Component({
  selector: 'app-manual-data-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './manual-data-dialog.component.html',
})
export class ManualDataDialogComponent {
  taskId: string = '';
  message: string = '';
  timeMinutes: number = 0;
  editMode: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trackingDataService: TrackingDataService
  ) {
  }

  checkTask(): void {
    const tasks = this.trackingDataService.getTasks();
    const task = tasks.find((t) => t.taskId === this.taskId);
    if (task) {
      this.message = `You have already logged ${task.timeTracked} on this task. You will override the existing data.`;
      this.timeMinutes = task.totalSeconds / 60;
      this.editMode = true
    } else {
      this.message = 'This is a new task.';
      this.editMode = false;
      this.timeMinutes = 0;
    }
  }
}
