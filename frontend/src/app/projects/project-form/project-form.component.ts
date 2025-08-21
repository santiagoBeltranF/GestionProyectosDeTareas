import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IProject, IProjectData, ProjectService } from '../project.service';
import { MaterialModule } from '../../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  private projectId?: number;
  private originalProject?: IProject;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''] 
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.projectId = +idParam;
      
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (project) => {
          this.originalProject = project;
          this.projectForm.patchValue({
            name: project.name,
            description: project.company.catchPhrase 
          });
        },
        error: (err) => {
          this.snackBar.open('No se pudo cargar el proyecto para editar.', 'Cerrar', { duration: 5000 });
          this.router.navigate(['/projects']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.projectId && this.originalProject) {
      this.updateProject();
    } else {
      this.createProject();
    }
  }

  private updateProject(): void {
    const updatedProjectData: IProject = {
      ...this.originalProject!,
      name: this.projectForm.value.name,
      company: {
        ...this.originalProject!.company,
        catchPhrase: this.projectForm.value.description
      }
    };

    this.projectService.updateProject(this.projectId!, updatedProjectData).subscribe({
      next: (updatedProject) => {
        this.snackBar.open(`Proyecto "${updatedProject.name}" actualizado con éxito.`, 'Cerrar', { duration: 3000 });
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.snackBar.open('Hubo un error al actualizar el proyecto.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  private createProject(): void {
    const projectData: IProjectData = {
      name: this.projectForm.value.name,
      company: {
        catchPhrase: this.projectForm.value.description
      }
    };
    
    this.projectService.createProject(projectData).subscribe({
      next: (newProject) => {
        this.snackBar.open(`Proyecto "${newProject.name}" creado con éxito.`, 'Cerrar', { duration: 3000 });
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.snackBar.open('Hubo un error al crear el proyecto.', 'Cerrar', { duration: 5000 });
      }
    });
  }
}