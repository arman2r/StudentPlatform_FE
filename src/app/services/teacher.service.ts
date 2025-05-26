import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ITeacherSubject } from '../interfaces/ITeacherSubject.interface';
import { ISubject } from '../interfaces/ISubject.interface';
import { ITeacher } from '../interfaces/ITeacher.interface';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = environment.ApiUrl;
  user = inject(AuthService).getUserInfoFromToken();

  constructor(private http: HttpClient) { }

  setSubjectsTeacher(subjectId: number[]): Observable<ITeacherSubject> {
    const user = this.user;
    console.log(user);
    return this.http.put<ITeacherSubject>(
      this.apiUrl + '/Teacher/update-subjects',
      { TeacherId: parseInt(user?.id as string), SubjectIds: subjectId }
    ).pipe(
      catchError((err) => {
        console.error('Error al cargar las materias al profesor:', err);
        return throwError(() => new Error('Error en la petición'));
      })
    );
  }

  getTeacherDetail(): Observable<ITeacher> {
    const user = this.user;
    return this.http.get<ITeacher>(this.apiUrl + '/Teacher/' + user?.id).pipe(
      catchError((err) => {
        console.error('Error al cargar el profesor:', err);
        return throwError(() => new Error('Error en la petición'));
      })
    );
  }
}
