import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { ISubject } from '../interfaces/ISubject.interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  private apiUrl = environment.ApiUrl;
  private subjects$ = new BehaviorSubject<ISubject[]>([]);

  constructor(private http: HttpClient) {}


  loadSubjects(): Observable<ISubject[]> {
    return this.http.get<ISubject[]>(this.apiUrl+'/Subject').pipe(
      tap((subjects) => this.subjects$.next(subjects)), // Actualiza el BehaviorSubject
      catchError((err) => {
        console.error('Error al cargar materias:', err);
        return throwError(() => new Error('Error en la petición'));
      })
    );
  }

  // Getter para acceder a los datos como Observable (para suscripciones)
  getSubjects(): Observable<ISubject[]> {
    return this.subjects$.asObservable();
  }

  getCurrentSubjects(): ISubject[] {
    return this.subjects$.getValue();
  }
}