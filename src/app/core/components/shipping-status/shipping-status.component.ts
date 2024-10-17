import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CircleDotIconComponent } from '@core/icons/circle-dot';
import { CommonModule } from '@angular/common';
import { ContainerIconComponent } from '@core/icons/container';
import { LucideAngularModule, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-shipping-status',
  standalone: true,
  imports: [
    CommonModule,
    ContainerIconComponent,
    CircleDotIconComponent,
    LucideAngularModule,
  ],
  templateUrl: './shipping-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingStatusComponent {
  mapPin = MapPin;
  @Input() currentStep: number = 0;

  departureDate: string = '2023-06-01';
  estimatedArrivalDate: string = '2023-06-15';
  steps: string[] = ['Order Placed', 'In Transit', 'At Port', 'Delivered'];

  get progressPercentage(): number {
    return Math.round((this.currentStep / (this.steps.length - 1)) * 100);
  }

  get statusMessage(): string {
    switch (this.currentStep) {
      case 0:
        return 'Your order has been placed and is being processed.';
      case 1:
        return 'Your container is currently in transit. Estimated arrival at port in 2 days.';
      case 2:
        return 'Your container has arrived at the port. Customs clearance in progress.';
      case 3:
        return 'Your container has been delivered successfully. Thank you for using our service!';
      default:
        return 'Status unknown. Please contact customer support for more information.';
    }
  }

  get estimatedDelivery(): string {
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 7));
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
