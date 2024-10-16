import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule, Container } from 'lucide-angular';

@Component({
  selector: 'app-container-card',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './container-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerCardComponent {
  Container = Container;
}
