import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ITask, TaskService } from '../task.service';
import { IProject, ProjectService } from '../../projects/project.service';
import { MaterialModule } from '../../material.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';
import { TaskDialogMode } from '../task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  public tasks: ITask[] = [];
  public project?: IProject;
  public isLoading = true;
  public error: string | null = null;
  public projectId!: number;

  public displayedColumns: string[] = ['title', 'status', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = +idParam;
      this.subscribeToTasks();
      this.loadData();
    } else {
      this.error = "No se ha proporcionado un ID de proyecto.";
      this.isLoading = false;
    }
  }

  subscribeToTasks(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
        if (this.isLoading) {
          this.isLoading = false;
        }
      });
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      project: this.projectService.getProjectById(this.projectId),
      tasks: this.taskService.getTasksByProjectId(this.projectId)
    }).subscribe({
      next: ({ project }) => { this.project = project; },
      error: () => {
        this.error = 'Error al cargar los datos del proyecto.';
        this.isLoading = false;
      }
    });
  }

  openTaskDialog(mode: TaskDialogMode, task?: ITask): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '680px',
      panelClass: 'app-dialog',
      data: { mode, projectId: this.projectId, task }
    });
    dialogRef.afterClosed().subscribe();
  }

  editTask(task: ITask): void {
    this.openTaskDialog('edit', task);
  }

  deleteTask(task: ITask): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'app-dialog',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`,
        confirmLabel: 'Eliminar'
      }
    });
    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.taskService.deleteTask(task.id).subscribe();
    });
  }

  toggleTaskStatus(task: ITask): void {
    const updatedTaskData = { ...task, completed: !task.completed };
    this.taskService.updateTask(task.id, updatedTaskData).subscribe({
      error: () => {
        this.snackBar.open('No se pudo actualizar el estado de la tarea.', 'Cerrar', { duration: 5000 });
        this.loadData();
      }
    });
  }

  getStatusLabel(task: ITask): string { return task.completed ? 'Finalizado' : 'En Progreso'; }
  getStatusClass(task: ITask): string { return task.completed ? 'status-completed' : 'status-progress'; }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}