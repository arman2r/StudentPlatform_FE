import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-toggle-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './toggle-login.component.html',
  styleUrl: './toggle-login.component.scss',
})
export class ToggleLoginComponent {

  @Input() loading?: boolean = false;
  router = inject(Router);
  selectedValue = signal('login-student');

  ngOnInit(): void {
    this.setInitialValue();
  }

  setInitialValue(): void {
    const currentUrl = this.router.url;

    if (currentUrl.includes('login-teacher')) {
      this.selectedValue.set('login-teacher');
    } else {
      // Por defecto o si contiene 'login-student'
      this.selectedValue.set('login-student');
    }
  }

  onToggleChange(event: any): void {
    const newValue = event.value;

    // Actualizar la señal
    this.selectedValue.set(newValue);

    // Navegar a la ruta correspondiente
    this.router.navigate([newValue]);
  }

}
