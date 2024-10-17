import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ShipListComponent } from './ship-list.component';
import { ShippingService } from '@services/shipping.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ToastNotificationService } from '@services/toast-notification.service';

// Mock de ShippingService
class MockShippingService {
  getVessels = jest.fn().mockReturnValue(
    of([
      { id: '1', name: 'Barco A' },
      { id: '2', name: 'Barco B' }, 
    ])
  );
}

// Mock de ToastNotificationService
class MockToasNotificationService {
  toastSuccess = jest.fn();
  toastError = jest.fn();
}

class MockRouter {
  navigate = jest.fn();
}

describe('ShipListComponent', () => {
  let component: ShipListComponent;
  let fixture: ComponentFixture<ShipListComponent>;
  let shippingService: MockShippingService;
  let toastService: MockToasNotificationService;
  let router: MockRouter;

  beforeEach(() => {
    shippingService = new MockShippingService();
    router = new MockRouter();

    TestBed.configureTestingModule({
      imports: [ShipListComponent],
      providers: [
        { provide: ShippingService, useValue: shippingService },
        { provide: ToastNotificationService, useValue: toastService },
        { provide: Router, useValue: router },
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShipListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vessels on init', () => {
    component.ngOnInit();
    expect(shippingService.getVessels).toHaveBeenCalled();
    expect(component.vessels.length).toBe(2);
    expect(component.sortedVessels.length).toBe(2);
  });

  it('should filter vessels based on search query', () => {
    component.ngOnInit();

    const eventA = { target: { value: 'Barco A' } } as unknown as Event;
    component.onSearchInput(eventA);
    expect(component.sortedVessels.length).toBe(1);
    expect(component.sortedVessels[0].name).toBe('Barco A');

    const eventEmpty = { target: { value: '' } } as unknown as Event;
    component.onSearchInput(eventEmpty);
    expect(component.sortedVessels.length).toBe(2);
  });

  it('should navigate to reports on viewReports', () => {
    const vesselId = '1';
    component.viewReports(vesselId);
    expect(router.navigate).toHaveBeenCalledWith(['/report', vesselId]);
  });

  it('should select a container', () => {
    const container = { id: 'C1' };
    component.selectContainer(container);
    expect(component.selectedContainer).toEqual(container);
  });
});
