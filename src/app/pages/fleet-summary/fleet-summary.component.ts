import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ContainerCardComponent } from '../../core/components/container-card/container-card.component';
import { ReportCardComponent } from '../../core/components/report-card/report-card.component';
import { VesselCardComponent, UseCardComponent } from '../../core';


@Component({
  selector: 'app-fleet-summary',
  standalone: true,
  imports: [
    CommonModule,
    VesselCardComponent,
    ContainerCardComponent,
    UseCardComponent,
    ReportCardComponent,
    NgOptimizedImage
  ],
  templateUrl: './fleet-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetSummaryComponent { }
