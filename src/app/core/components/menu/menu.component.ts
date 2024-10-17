import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconSettingsComponent } from '@core/icons/settings'

export interface MenuItem {
  label: string;
  icon?: any;
  action: () => void;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, IconSettingsComponent],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() buttonIcon!: any;
  isOpen = false;

  openMenu() {
    this.isOpen = !this.isOpen;
  }

  executeAction(action: () => void) {
    action();
    this.isOpen = false;
  }
}
