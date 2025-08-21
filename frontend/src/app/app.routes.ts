    import { Routes } from '@angular/router';
    import { LoginComponent } from './auth/login/login.component';
    import { authGuard } from './guards/auth.guard';
    
    export const routes: Routes = [
        {
            path: 'auth',
            component: LoginComponent
        },
        {
            path: 'projects',
            canActivate: [authGuard],
            loadChildren: () => import('./projects/projects.routes').then(m => m.PROJECTS_ROUTES)
        },
        {
            path: 'projects/:id/tasks',
            canActivate: [authGuard],
            loadChildren: () => import('./tasks/tasks.routes').then(m => m.TASKS_ROUTES)
        },
        {
            path: '',
            redirectTo: '/projects',
            pathMatch: 'full'
        },
        {
            path: '**',
            redirectTo: '/projects'
        }
    ];