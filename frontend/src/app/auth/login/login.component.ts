import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: ['password', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        this.snackBar.open('¡Login correcto!', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.snackBar.open(`Error: ${err.message || 'Fallo en el inicio de sesión.'}`, 'Cerrar', { duration: 5000 });
      }
    });
  }

  onForgot(): void {
    this.snackBar.open('Recuperación de contraseña no implementada aún.', 'Cerrar', { duration: 3000 });
  }
}
