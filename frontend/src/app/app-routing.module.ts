import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateGuard } from './activate.guard';
import { ArchiveComponent } from './archive/archive.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatatableComponent } from './datatable/datatable.component';
import { LoginComponent } from './login/login.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { StatsComponent } from './stats/stats.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserGuard } from './user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ActivateGuard] }, // canActivate: [ActivateGuard]
  { path: 'project-details/:id', component: ProjectDetailsComponent},
  { path: 'usermanagement', component: UserManagementComponent, canActivate: [UserGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [UserGuard] }, //canActivate: [UserGuard]
  { path: 'inventory', component: DatatableComponent, canActivate: [ActivateGuard] },
  { path: 'usermanagement', component: UserManagementComponent, canActivate: [UserGuard], outlet: "outlet1"},
  { path: 'archive', component: ArchiveComponent, canActivate: [ActivateGuard] }
  // { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
