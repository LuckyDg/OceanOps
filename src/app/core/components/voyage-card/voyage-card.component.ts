import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-voyage-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './voyage-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoyageCardComponent { }
