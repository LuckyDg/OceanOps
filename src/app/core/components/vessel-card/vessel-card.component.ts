import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule, Ship } from 'lucide-angular';
@Component({
  selector: 'app-vessel-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './vessel-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VesselCardComponent {
  Ship = Ship;
}
