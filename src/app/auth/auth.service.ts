import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly users: User[] = [
    { name: 'Admin User', role: 'admin' },
    { name: 'Manager User', role: 'manager' },
    { name: 'Viewer User', role: 'viewer' }
  ];

  private loggedUser: User | null = null;
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('loggedUser');
      if (storedUser) {
        this.loggedUser = JSON.parse(storedUser);
        this.userSubject.next(this.loggedUser);
      }
    }
  }

  login(role: string) {
    this.loggedUser = this.users.find(user => user.role === role) || null;
    if (this.loggedUser && isPlatformBrowser(this.platformId)) {
      localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
      this.userSubject.next(this.loggedUser);
    }
  }

  logout() {
    this.loggedUser = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedUser');
    }
    this.userSubject.next(null);
  }

  getUser() {
    return this.loggedUser;
  }
}
