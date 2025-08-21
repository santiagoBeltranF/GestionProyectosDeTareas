import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IProject, ProjectService } from '../project.service';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog.component';
import { ProjectDialogMode } from '../project-form-dialog/project-form-dialog.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  public projects: IProject[] = [];
  public filteredProjects: IProject[] = [];
  public isLoading = true;
  public error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subscribeToProjects();
    this.loadProjects();
  }

  subscribeToProjects(): void {
    this.projectService.projects$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projects => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.isLoading = false;
      });
  }

  loadProjects(): void {
    this.isLoading = true;
    this.error = null;
    this.projectService.getProjects().subscribe({
      error: () => {
        this.error = 'No se pudieron cargar los proyectos.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(term: string): void {
    const t = (term || '').toLowerCase();
    this.filteredProjects = this.projects.filter(p =>
      p.name.toLowerCase().includes(t) ||
      (p.company?.name || '').toLowerCase().includes(t) ||
      (p.company?.catchPhrase || '').toLowerCase().includes(t)
    );
  }

  getClientName(p: IProject): string {
    return p.company?.name || '—';
  }

  getProgress(p: IProject): number {
    const seed = (p.id || 1) * 31
      + (p.name?.length || 0) * 7
      + (p.company?.name?.length || 0) * 3;
    const pct = (seed % 91) + 5;
    return Math.min(96, Math.max(5, pct));
  }

  viewTasks(projectId: number): void {
    this.router.navigate(['/projects', projectId, 'tasks']);
  }

  openProjectDialog(mode: ProjectDialogMode, project?: IProject): void {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '680px',
      panelClass: 'app-dialog',
      data: { mode, project }
    });
    dialogRef.afterClosed().subscribe();
  }

  openDeleteModal(project: IProject): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'app-dialog',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar'
      }
    });
    dialogRef.afterClosed().subscribe(ok => ok && this.confirmDelete(project.id));
  }

  confirmDelete(projectId: number): void {
    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.snackBar.open('Proyecto eliminado con éxito.', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('No se pudo eliminar el proyecto.', 'Cerrar', { duration: 5000, panelClass: ['mat-warn'] });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
