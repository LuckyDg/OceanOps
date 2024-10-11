import { Routes } from '@angular/router';
import { FleetSummaryComponent } from './fleet-summary/fleet-summary.component';
import { FleetShipComponent } from './core/components/fleet-ship/fleet-ship.component';

export const routes: Routes = [
    { path: '', component: FleetSummaryComponent },
    { path: 'fleetship', component: FleetShipComponent },
    { path: '**', redirectTo: '' }
];
