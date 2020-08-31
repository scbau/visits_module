import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotVisitedComponent } from './modules/notvisited/not.visited.component';
import { ChecklistComponent } from './modules/checklist/checklist.component';
import { ForkliftChecklistComponent } from './modules/checklist/forklift.checklist.component';
import { VSRChecklistComponent } from './modules/checklist/vsr.checklist.component';
import { WarehouseChecklistComponent } from './modules/checklist/warehouse.checklist.component';
import { LoginComponent } from './modules/login/login.component';
import { SettingsComponent } from './modules/settings/settings.component';
// import { UploadComponent } from './modules/settings/upload.component';

import { AuthGuard } from './modules/_helpers/auth.guard';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    // outlet: 'sidebarContent'
  },
  {
    path: 'dashboard/not-visited',
    component: NotVisitedComponent,
    // outlet: 'sidebarContent'
  },
  {
    path: 'dashboard/checksheet',
    component: ChecklistComponent,
    // outlet: 'sidebarContent'
  },
  {
    path: 'dashboard/checksheet/vsr',
    component: VSRChecklistComponent,
    // outlet: 'sidebarContent'
  },
  {
    path: 'dashboard/checksheet/forklift',
    component: ForkliftChecklistComponent,
    // outlet: 'sidebarContent'
  },
  {
    path: 'dashboard/checksheet/warehouse',
    component: WarehouseChecklistComponent,
    // outlet: 'sidebarContent'
  },
  {
    path: 'dashboard/settings',
    component: SettingsComponent,
    // outlet: 'sidebarContent'
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
