import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotVisitedComponent } from './modules/notvisited/not.visited.component';
import { ChecklistComponent } from './modules/checklist/checklist.component';
import { ForkliftChecklistComponent } from './modules/checklist/forklift.checklist.component';
import { VSRChecklistComponent } from './modules/checklist/vsr.checklist.component';
import { WarehouseChecklistComponent } from './modules/checklist/warehouse.checklist.component';


const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard/not-visited',
        component: NotVisitedComponent
    },
    {
        path: 'dashboard/checksheet',
        component: ChecklistComponent
  },
  {
    path: 'dashboard/checksheet/vsr',
    component: VSRChecklistComponent
  },
  {
    path: 'dashboard/checksheet/forklift',
    component: ForkliftChecklistComponent
  },
  {
    path: 'dashboard/checksheet/warehouse',
    component: WarehouseChecklistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
