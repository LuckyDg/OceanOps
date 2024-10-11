import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-use-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './use-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseCardComponent { }
