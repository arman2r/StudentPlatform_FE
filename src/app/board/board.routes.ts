import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'register-subject'
    },
    {
        path: 'register-subject',
        loadComponent: () => import('./register-subject/register-subject.component').then(m => m.RegisterSubjectComponent)
    },
    {
        path: 'student-list',
        loadComponent: () => import('./student-list/student-list.component').then(m => m.StudentListComponent)
    }
]