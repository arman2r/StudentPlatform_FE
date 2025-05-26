import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { IAuthState } from '../../interfaces/IAuthState.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.ApiUrl;
  private readonly AUTH_KEY = 'auth_token';
  private state = signal<IAuthState>({
    token: null,
    user: null,
  });

  // Señales públicas (readonly)
  isAuthenticated = computed(() => !!this.state().token);
  currentUser = computed(() => this.state().user);

  constructor(private http: HttpClient, private router: Router) {
    this.loadTokenFromStorage();
  }

  login(email: string, password: string) {

    const segments = this.router.url.split('/');
    const userType = segments[1];

    console.log(userType);

    return this.http
      .post<{ token: string }>(this.apiUrl + '/auth/' + userType, { email, password })
      .pipe(
        tap((response) => this.setToken(response.token)),
      )
      .pipe(
        catchError((err) => {
          console.error('Error al iniciar sesión:', err);
          return throwError(() => new Error('Usuario no existe'));
        })
      );
  }

  logout() {
    const role = this.getUserInfoFromToken()?.role;
    localStorage.removeItem(this.AUTH_KEY);
    this.state.set({ token: null, user: null });
    console.log(this.state());
    if (role === 'Student') {
      if (this.router.url !== '/login-student') {
        this.router.navigate(['/login-student']);
        this.getUserInfoFromToken();
      }
    } else {
      if (this.router.url !== '/login-teacher') {
        this.router.navigate(['/login-teacher']);
        this.getUserInfoFromToken();
      }
    }
  }

  private setToken(token: string) {
    const decoded = jwtDecode(token) as { sub: string; email: string };
    localStorage.setItem(this.AUTH_KEY, token);
    this.state.set({
      token,
      user: { id: decoded.sub, email: decoded.email },
    });
  }

  private loadTokenFromStorage() {
    const token = localStorage.getItem(this.AUTH_KEY);
    if (token && !this.isTokenExpired(token)) {
      this.setToken(token);
    }
  }

  public isTokenExpired(token: string): boolean {
    try {
      const isToken = this.getToken();
      const { exp } = jwtDecode(token);
      return exp ? Date.now() >= exp * 1000 : true;
    } catch {
      return true;
    }
  }

  getUserInfoFromToken(): { id: string; name: string; email: string, role: string } | null {
    const token = this.getToken();
    //console.log('token',token);
    if (!token || this.isTokenExpired(token)) return null;

    try {
      const decoded = jwtDecode(token) as {
        [key: string]: string;
      };

      //console.log('decoded',decoded);

      const id = decoded['Id'];
      const name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      return { id, name, email, role };
    } catch {
      return null;
    }
  }


  getToken(): string | null {
    return this.state().token;
  }
}
