import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { ShippingService } from '@services/shipping.service';
import { Router } from '@angular/router';
import { Vessel } from '@models/buques.model';
import { debounceTime, Subject } from 'rxjs';
import {
  IconCheckComponent,
  IconChevronDownComponent,
  ContainerIconComponent,
  ReportIconComponent,
} from '@core/index';

@Component({
  selector: 'app-ship-list',
  standalone: true,
  imports: [
    CommonModule,
    IconCheckComponent,

    IconChevronDownComponent,
    ContainerIconComponent,
    ReportIconComponent,
  ],
  templateUrl: './ship-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipListComponent implements OnInit {
  // Iconos
  IconCheck = IconCheckComponent;
  IconChevronDown = IconChevronDownComponent;

  vessels: Vessel[] = [];
  selectedContainer: any;
  isAdmin: boolean = true;

  sortedVessels: Vessel[] = [];
  searchQuery = new Subject<string>();

  constructor(
    private readonly shippingService: ShippingService,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.shippingService.getVessels().subscribe((vessels: Vessel[]) => {
      this.vessels = vessels;
      this.sortedVessels = [...vessels];
      this.cd.markForCheck();
    });

    this.searchQuery.pipe(debounceTime(300)).subscribe(query => {
      this.searchVessels(query);
      this.cd.markForCheck();
    });
  }

  viewReports(vesselId: string): void {
    this.router.navigate(['/report', vesselId]);
  }

  selectContainer(container: any): void {
    this.selectedContainer = container;
  }

  searchVessels(query: string) {
    if (query) {
      this.sortedVessels = this.vessels.filter(vessel =>
        vessel.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.sortedVessels = [...this.vessels];
    }
    this.cd.markForCheck();
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.sortedVessels = this.vessels.filter(vessel =>
      vessel.name.toLowerCase().includes(query)
    );
  }
}
