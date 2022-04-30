import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateGuard } from './activate.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserGuard } from './user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ActivateGuard] }, // canActivate: [ActivateGuard]
  { path: 'project-details', component: ProjectDetailsComponent, canActivate: [ActivateGuard]},
  { path: 'usermanagement', component: UserManagementComponent, canActivate: [UserGuard] }, //canActivate: [UserGuard]
  // { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
