import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError, map } from 'rxjs';
import { IUser } from '../interfaces/IUser.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../core/auth/auth.service';
import { IStudentSubject } from '../interfaces/IStudentSubject.interface';
import { ITeacherBySubject } from '../interfaces/ITeacherSubject.interface';
import { PartnerStudent } from '../interfaces/IParterners.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = environment.ApiUrl;
  private student$ = new BehaviorSubject<IUser>({
    id: 0,
    fullName: '',
    email: '',
    passwordHash: '',
    createdAt: '',
    subjects: []
  });
  private authService = inject(AuthService);
  get user() {
    return this.authService.getUserInfoFromToken();
  }


  constructor(private http: HttpClient) { }


  isStudent(): Observable<IUser> {
    const user = this.user;
    console.log('que usuario llega', user);
    if (user?.role !== 'Student') {
      console.log('No es un estudiante');
      return this.http.get<IUser>(this.apiUrl + '/Teacher/' + user?.id).pipe(
        tap((student) => this.student$.next(student)), // Actualiza el BehaviorSubject con el estudiante directamente
        catchError((err) => {
          console.error('Error al cargar estudiante:', err);
          return throwError(() => new Error('Error en la petición'));
        })
      );
    } else {
      console.log('Es un estudiante');
      return this.http.get<IUser>(this.apiUrl + '/Student/' + user?.id).pipe(
        tap((student) => this.student$.next(student)), // Actualiza el BehaviorSubject con el estudiante directamente
        catchError((err) => {
          console.error('Error al cargar estudiante:', err);
          return throwError(() => new Error('Error en la petición'));
        })
      );
    }

  }

  // Getter para acceder a los datos como Observable (para suscripciones)
  getStudent(): Observable<IUser> {
    return this.student$.asObservable();
  }

  getCurrentSubjects(): IUser {
    return this.student$.getValue();
  }

  getTeacherBySubject(subjectId: number): Observable<ITeacherBySubject[]> {
    return this.http.get<ITeacherBySubject[]>(this.apiUrl + '/Student/' + subjectId + '/teachers').pipe(
      catchError((err) => {
        console.error('Error al cargar el profesor:', err);
        return throwError(() => new Error('Error en la petición'));
      })
    );
  }

  setSubjectsStudent(subjectIds: IStudentSubject[]): Observable<IStudentSubject> {
    const user = this.user;
    return this.http.put<IStudentSubject>(
      this.apiUrl + '/Student/' + user?.id + '/assign-subjects',
      subjectIds
    ).pipe(
      catchError((err) => {
        console.error('Error al cargar las materias al profesor:', err.error.message);
        return throwError(() => err.error.message);
      })
    );
  }

  getStudyPartner(): Observable<PartnerStudent> {
    const user = this.user;
    console.log('que usuario llega', user);
    return this.http.get<PartnerStudent>(this.apiUrl + '/' + user?.role + '/' + user?.id + '/classmates')
      .pipe(
        catchError((err) => {
          console.error('Error al cargar los compañeros de estudio:', err);
          return throwError(() => err.error.message);
        })
      );
  }
}
