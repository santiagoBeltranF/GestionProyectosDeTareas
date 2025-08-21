import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

export interface ITask {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface ITaskData {
  userId: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private localStorageKey = 'tasks_data';

  private tasksSubject = new BehaviorSubject<ITask[]>([]);
  public tasks$: Observable<ITask[]> = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTasksByProjectId(projectId: number): Observable<ITask[]> {
    const allLocalTasks = this.getTasksFromLocalStorage();
    const tasksForProject = allLocalTasks.filter(task => task.userId === projectId);

    if (tasksForProject.length > 0) {
      this.tasksSubject.next(tasksForProject);
      return of(tasksForProject);
    } else {
      return this.http.get<ITask[]>(`${this.apiUrl}?userId=${projectId}`).pipe(
        tap(apiTasks => {
          const otherProjectTasks = allLocalTasks.filter(task => task.userId !== projectId);
          this.saveTasksToLocalStorage([...otherProjectTasks, ...apiTasks]);
          this.tasksSubject.next(apiTasks);
        })
      );
    }
  }

  getTaskById(id: number): Observable<ITask> {
    const allTasks = this.getTasksFromLocalStorage();
    const foundTask = allTasks.find(task => task.id === id);
    if (foundTask) {
      return of(foundTask);
    }
    return this.http.get<ITask>(`${this.apiUrl}/${id}`);
  }

  createTask(taskData: ITaskData): Observable<ITask> {
    const allTasks = this.getTasksFromLocalStorage();

    const newId = allTasks.length > 0 ? Math.max(...allTasks.map(t => t.id)) + 1 : 1;

    const newTask: ITask = {
      ...taskData,
      id: newId
    };

    const updatedTasks = [...allTasks, newTask];
    this.saveTasksToLocalStorage(updatedTasks);

    const tasksForProject = updatedTasks.filter(task => task.userId === taskData.userId);
    this.tasksSubject.next(tasksForProject);

    return of(newTask);
  }

  updateTask(id: number, taskData: Partial<ITask>): Observable<ITask> {
    let allTasks = this.getTasksFromLocalStorage();
    let taskToUpdate: ITask | undefined;

    const updatedTasks = allTasks.map(task => {
      if (task.id === id) {
        taskToUpdate = { ...task, ...taskData };
        return taskToUpdate;
      }
      return task;
    });

    if (!taskToUpdate) {
      return of(taskData as ITask);
    }
    
    this.saveTasksToLocalStorage(updatedTasks);

    const tasksForProject = updatedTasks.filter(task => task.userId === taskToUpdate!.userId);
    this.tasksSubject.next(tasksForProject);

    return of(taskToUpdate);
  }

  deleteTask(id: number): Observable<{}> {
    let allTasks = this.getTasksFromLocalStorage();
    const taskToDelete = allTasks.find(t => t.id === id);
    if (!taskToDelete) return of({});

    const updatedTasks = allTasks.filter(task => task.id !== id);
    this.saveTasksToLocalStorage(updatedTasks);

    const tasksForProject = updatedTasks.filter(task => task.userId === taskToDelete.userId);
    this.tasksSubject.next(tasksForProject);
    
    return of({});
  }
  
  private saveTasksToLocalStorage(tasks: ITask[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }

  private getTasksFromLocalStorage(): ITask[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }
}