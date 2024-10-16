import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  canActivate(): boolean {
    const user = this.authService.getUser();

    if (user) {
      if (user.role === 'admin' || user.role === 'manager') {
        return true; // Admin y Manager tienen acceso total
      } else if (user.role === 'viewer') {
        // Solo permitir acceso al dashboard para el rol viewer
        const currentRoute = this.router.routerState.snapshot.root.firstChild?.routeConfig?.path;
        if (currentRoute === 'dashboard') {
          return true;
        }
      }
    }

    this.router.navigate(['/']);
    return false;
  }
}
