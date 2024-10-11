import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vessel-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './vessel-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VesselCardComponent { }
