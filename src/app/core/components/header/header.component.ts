import { AuthService } from '@services/auth.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconRocketComponent } from '@core/icons/rocket';
import { ToastNotificationService } from '@services/toast-notification.service';
import { User } from '@models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconRocketComponent, FormsModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  IconRocket = IconRocketComponent;

  roles = ['admin', 'manager', 'viewer'];
  selectedRole: string = '';
  user: User | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastNotificationService
  ) {
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
      this.toastService.toastSuccess('Successfully logged out!');
    } else {
      try {
        this.authService.login(this.selectedRole);
        this.toastService.toastSuccess('Successfully logged in!');
      } catch (error) {
        this.toastService.toastError('Login failed. Please try again.');
      }
    }
  }
}
