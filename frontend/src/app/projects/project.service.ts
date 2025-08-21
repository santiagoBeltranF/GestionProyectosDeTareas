import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

export interface IProject {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface IProjectData {
  name: string;
  company: {
    catchPhrase: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private localStorageKey = 'projects_data';

  private projectsSubject = new BehaviorSubject<IProject[]>([]);
  public projects$: Observable<IProject[]> = this.projectsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProjects(): Observable<IProject[]> {
    const localProjects = this.getProjectsFromLocalStorage();
    if (localProjects.length > 0) {
      this.projectsSubject.next(localProjects);
      return of(localProjects);
    } else {
      return this.http.get<IProject[]>(this.apiUrl).pipe(
        tap(apiProjects => {
          this.saveProjectsToLocalStorage(apiProjects);
          this.projectsSubject.next(apiProjects);
        })
      );
    }
  }

  getProjectById(id: number): Observable<IProject> {
    const allProjects = this.getProjectsFromLocalStorage();
    const foundProject = allProjects.find(p => p.id === id);
    if (foundProject) {
      return of(foundProject);
    }
    return this.http.get<IProject>(`${this.apiUrl}/${id}`);
  }

  createProject(projectData: IProjectData): Observable<IProject> {
    const allProjects = this.getProjectsFromLocalStorage();
    const newId = allProjects.length > 0 ? Math.max(...allProjects.map(p => p.id)) + 1 : 11;

    const newProject: IProject = {
      id: newId,
      name: projectData.name,
      username: projectData.name.replace(/\s+/g, '_').toLowerCase(),
      email: 'new@project.com',
      address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
      phone: '',
      website: '',
      company: {
        name: projectData.name,
        catchPhrase: projectData.company.catchPhrase,
        bs: ''
      }
    };

    const updatedProjects = [...allProjects, newProject];
    this.saveProjectsToLocalStorage(updatedProjects);
    this.projectsSubject.next(updatedProjects);

    return of(newProject);
  }

  updateProject(id: number, projectData: IProject): Observable<IProject> {
    let allProjects = this.getProjectsFromLocalStorage();
    const updatedProjects = allProjects.map(p => (p.id === id ? projectData : p));
    
    this.saveProjectsToLocalStorage(updatedProjects);
    this.projectsSubject.next(updatedProjects);

    return of(projectData);
  }

  deleteProject(id: number): Observable<{}> {
    let allProjects = this.getProjectsFromLocalStorage();
    const updatedProjects = allProjects.filter(p => p.id !== id);
    
    this.saveProjectsToLocalStorage(updatedProjects);
    this.projectsSubject.next(updatedProjects);
    
    return of({});
  }

  private saveProjectsToLocalStorage(projects: IProject[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(projects));
  }

  private getProjectsFromLocalStorage(): IProject[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }
}