import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule, Users } from 'lucide-angular';

@Component({
  selector: 'app-use-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './use-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseCardComponent {
  Users = Users;
}
