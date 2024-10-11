import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-fleet-ship',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './fleet-ship.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetShipComponent {

}
