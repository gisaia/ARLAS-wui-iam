import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardIamService, LoginComponent } from 'arlas-wui-toolkit';
import { HomeComponent } from './components/home/home.component';
import { PermissionComponent } from './components/permission/permission.component';
import { RoleComponent } from './components/role/role.component';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuardIamService],
    children: [
      { path: 'user', component: UserComponent, canActivate: [AuthGuardIamService] },
      { path: 'role', component: RoleComponent, canActivate: [AuthGuardIamService] },
      { path: 'permission', component: PermissionComponent, canActivate: [AuthGuardIamService] }
    ]
  },
  { path: 'login', component: LoginComponent },
  // otherwise redirect to login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
