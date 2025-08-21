import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITaskData, TaskService } from '../task.service';
import { MaterialModule } from '../../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  private projectId!: number;
  private taskId?: number;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      completed: [false]
    });
  }

  ngOnInit(): void {
    const projectIdParam = this.route.snapshot.parent?.paramMap.get('id');
    if (!projectIdParam) {
      this.snackBar.open('Error: No se encontró el ID del proyecto.', 'Cerrar', { duration: 5000 });
      this.router.navigate(['/projects']);
      return;
    }
    this.projectId = +projectIdParam;

    const taskIdParam = this.route.snapshot.paramMap.get('taskId');
    if (taskIdParam) {
      this.isEditMode = true;
      this.taskId = +taskIdParam;
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        this.taskForm.patchValue(task);
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData: ITaskData = {
      ...this.taskForm.value,
      userId: this.projectId
    };

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe(() => {
        this.snackBar.open('Tarea actualizada con éxito.', 'Cerrar', { duration: 3000 });
        this.navigateBackToTasks();
      });
    } else {
      this.taskService.createTask(taskData).subscribe(() => {
        this.snackBar.open('Tarea creada con éxito.', 'Cerrar', { duration: 3000 });
        this.navigateBackToTasks();
      });
    }
  }

  navigateBackToTasks(): void {
    this.router.navigate(['/projects', this.projectId, 'tasks']);
  }
}