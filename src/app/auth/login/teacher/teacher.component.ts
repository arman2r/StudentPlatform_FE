import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-teacher',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss'
})
export class TeacherComponent {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;
  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      PasswordHash: ['', Validators.required]
    })
  }

  onSubmit(e: Event) {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { Email, PasswordHash } = this.loginForm.value;
    this.loginForm.disable();
    this.authService.login(Email, PasswordHash).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['teacher/board']); // o cualquier ruta protegida
        this.openSnackBar('Bienvenido Profesor!', 'Cerrar');
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Correo o contraseña inválidos';
        console.error(err.message);
        this.openSnackBar('Error: ' + err.message, 'Cerrar');
        this.loginForm.enable();
      }
    });
  }

  private openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
