import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { ITask, ITaskData, TaskService } from '../task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export type TaskDialogMode = 'create' | 'edit';
export interface TaskDialogData {
  mode: TaskDialogMode;
  projectId: number;
  task?: ITask;
}

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.scss']
})
export class TaskFormDialogComponent implements OnInit {
  form: FormGroup;
  mode: TaskDialogMode;
  projectId: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
    this.mode = data.mode;
    this.projectId = data.projectId;
    this.form = this.fb.group({
      title: ['', Validators.required],
      completed: [false]
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.data.task) {
      this.form.patchValue({
        title: this.data.task.title,
        completed: this.data.task.completed
      });
    }
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    if (this.mode === 'create') {
      const payload: ITaskData = {
        title: this.form.value.title,
        completed: this.form.value.completed,
        userId: this.projectId
      };
      this.taskService.createTask(payload).subscribe({
        next: (t) => {
          this.snack.open('Tarea creada con éxito.', 'Cerrar', { duration: 2500 });
          this.dialogRef.close({ ok: true, action: 'created', task: t });
        },
        error: () => this.snack.open('Error al crear la tarea.', 'Cerrar', { duration: 3000 })
      });

    } else {
      const task = this.data.task!;
      const updated: ITask = { ...task, ...this.form.value };
      this.taskService.updateTask(task.id, updated).subscribe({
        next: (t) => {
          this.snack.open('Tarea actualizada con éxito.', 'Cerrar', { duration: 2500 });
          this.dialogRef.close({ ok: true, action: 'updated', task: t });
        },
        error: () => this.snack.open('Error al actualizar la tarea.', 'Cerrar', { duration: 3000 })
      });
    }
  }

  close(): void { this.dialogRef.close(); }
}
