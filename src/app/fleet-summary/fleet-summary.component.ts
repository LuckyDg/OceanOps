import { ShippingService } from './../service/shipping.service';
import { Vessel } from './../models/vessel.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { VesselCardComponent } from '../core/components/vessel-card/vessel-card.component';
import { VoyageCardComponent } from '../core/components/voyage-card/voyage-card.component';
import { UseCardComponent } from '../core/components/use-card/use-card.component';
import { RoutesCardComponent } from '../core/components/routes-card/routes-card.component';

@Component({
  selector: 'app-fleet-summary',
  standalone: true,
  imports: [
    CommonModule,
    VesselCardComponent,
    VoyageCardComponent,
    UseCardComponent,
    RoutesCardComponent
  ],
  templateUrl: './fleet-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetSummaryComponent implements OnInit {
  vessels: Vessel[] = [];

  constructor(private readonly shippingService: ShippingService) { }

  ngOnInit(): void {
    this.shippingService.getVessels().subscribe((data: Vessel[]) => {
      this.vessels = data;
    });
  }
}
