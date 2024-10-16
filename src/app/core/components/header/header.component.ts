import { IconRocket } from './../../icons/rocket';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    IconRocket,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  IconRocket = IconRocket;

  roles = ['admin', 'manager', 'viewer'];
  selectedRole: string = '';
  user: User | null = null;

  constructor(private readonly authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  get isLoggedIn() {
    return this.authService.getUser() !== null;
  }

  toggleLogin() {
    if (this.isLoggedIn) {
      this.authService.logout();
    } else {
      this.authService.login(this.selectedRole);
    }
  }
}
