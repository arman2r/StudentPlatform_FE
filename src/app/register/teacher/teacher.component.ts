import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/IUser.interface';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { RegisterService } from '../../services/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher',
  imports: [CommonModule, MatCardModule, RouterLink, MatButtonModule, MatInputModule, MatProgressBarModule, MatFormFieldModule, ReactiveFormsModule, FormsModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss'
})
export class TeacherComponent {
  registerForm!: FormGroup;
  userRegister!: IUser;
  loading$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder, private router: Router, private registerService: RegisterService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      FullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      PasswordHash: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]]
    })
  }

  private openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  onSubmit(e: Event) {
    if (this.registerForm.invalid) return;
    this.registerForm.disable()
    this.loading$.next(true);

    this.registerService
      .registerTeacher(this.registerForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.openSnackBar('¡Registro exitoso! Redirigiendo...', 'Cerrar');
          this.registerForm.reset();
          this.registerForm.enable()
        },
        error: (err) => {
          this.openSnackBar('Error: ' + err.message, 'Cerrar');
          this.loading$.next(false);
          this.registerForm.enable()
        },
        complete: () => {
          setTimeout(() => {
            this.loading$.next(false)
            this.router.navigate(['/login-teacher']); // Redirección limpia
          }, 3000);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
