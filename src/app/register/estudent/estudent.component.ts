import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RegisterService } from '../../services/register.service';
import { IUser } from '../../interfaces/IUser.interface';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudent',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './estudent.component.html',
  styleUrl: './estudent.component.scss'
})
export class EstudentComponent {

  private _snackBar = inject(MatSnackBar);
  registerForm!: FormGroup;
  userRegister!: IUser;
  loading$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

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
      .registerStudent(this.registerForm.value)
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
            this.router.navigate(['/login-student']); // Redirección limpia
          }, 3000);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
