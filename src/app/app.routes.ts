import { Routes } from '@angular/router';
import { ShipListComponent } from './pages/ship-list/ship-list.component';
import { FleetSummaryComponent } from './pages/fleet-summary/fleet-summary.component';
import { ReportComponent } from './pages/report/report.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: FleetSummaryComponent },
    { path: 'dashboard', component: FleetSummaryComponent, canActivate: [AuthGuard] },
    { path: 'ship-list', component: ShipListComponent, canActivate: [AuthGuard] },
    { path: 'report/:id', component: ReportComponent },
    { path: '**', redirectTo: '' }
];
