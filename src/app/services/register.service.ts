import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/IUser.interface';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = environment.ApiUrl;
  private readonly STUDENT_ENDPOINT = `${this.apiUrl}/Student/register`;
  private readonly TEACHER_ENDPOINT = `${this.apiUrl}/Teacher/register`;


  constructor(private http: HttpClient) { }

  registerStudent(student: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.STUDENT_ENDPOINT, student).pipe(
      catchError((error) => {
        console.error('Error en registerStudent:', error);
        return throwError(() => new Error('Error al registrar estudiante'));
      })
    );
  }

  registerTeacher(teacher: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.TEACHER_ENDPOINT, teacher).pipe(
      catchError((error) => {
        console.error('Error en registerTeacher:', error);
        return throwError(() => new Error('Error al registrar profesor'));
      })
    );
  }
}
