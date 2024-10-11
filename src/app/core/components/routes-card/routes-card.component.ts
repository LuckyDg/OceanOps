import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-routes-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './routes-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesCardComponent { }
