import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login-student'
    },
    {
        path: 'login-student',
        loadComponent: () => import('./auth/login/student/student.component').then(m => m.StudentComponent)
    },
    {
        path: 'login-teacher',
        loadComponent: () => import('./auth/login/teacher/teacher.component').then(m => m.TeacherComponent)
    },
    {
        path: 'register-student',
        loadComponent: () => import('./register/estudent/estudent.component').then(m => m.EstudentComponent)
    },
    {
        path: 'register-teacher',
        loadComponent: () => import('./register/teacher/teacher.component').then(m => m.TeacherComponent)
    },
    {
        path:':userType/board',
        loadComponent: () => import('./board/board.component').then(m => m.BoardComponent),
        loadChildren: () => import('./board/board.routes').then(m => m.routes),
        canActivate: [authGuard]
    }
];
