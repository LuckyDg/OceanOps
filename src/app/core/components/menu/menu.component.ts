import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  IconSettings,
  IconDelete,
  IconEdit,
  IconMore,
} from '../../index';

export interface MenuItem {
  label: string;
  icon: any;
  action: () => void;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, IconSettings, IconDelete, IconEdit, IconMore
  ],
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
