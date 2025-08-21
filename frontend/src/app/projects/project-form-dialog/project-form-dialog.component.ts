import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { IProject, IProjectData, ProjectService } from '../project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ProjectDialogMode = 'create' | 'edit';
export interface ProjectDialogData {
  mode: ProjectDialogMode;
  project?: IProject;
}

@Component({
  selector: 'app-project-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './project-form-dialog.component.html',
  styleUrls: ['./project-form-dialog.component.scss']
})
export class ProjectFormDialogComponent implements OnInit {
  form: FormGroup;
  mode: ProjectDialogMode;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<ProjectFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogData
  ) {
    this.mode = data.mode;
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.data.project) {
      this.form.patchValue({
        name: this.data.project.name,
        description: this.data.project.company?.catchPhrase || ''
      });
    }
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    if (this.mode === 'create') {
      const payload: IProjectData = {
        name: this.form.value.name,
        company: { catchPhrase: this.form.value.description }
      };
      this.projectService.createProject(payload).subscribe({
        next: (p) => {
          this.snack.open(`Proyecto "${p.name}" creado.`, 'Cerrar', { duration: 2500 });
          this.dialogRef.close({ ok: true, action: 'created', project: p });
        },
        error: () => this.snack.open('Error al crear el proyecto.', 'Cerrar', { duration: 3000 })
      });

    } else {
      const original = this.data.project!;
      const updated: IProject = {
        ...original,
        name: this.form.value.name,
        company: {
          ...original.company,
          catchPhrase: this.form.value.description
        }
      };
      this.projectService.updateProject(original.id, updated).subscribe({
        next: (p) => {
          this.snack.open(`Proyecto "${p.name}" actualizado.`, 'Cerrar', { duration: 2500 });
          this.dialogRef.close({ ok: true, action: 'updated', project: p });
        },
        error: () => this.snack.open('Error al actualizar el proyecto.', 'Cerrar', { duration: 3000 })
      });
    }
  }

  close(): void { this.dialogRef.close(); }
}
