import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardIamService, LoginComponent } from 'arlas-wui-toolkit';
import { HomeComponent } from './components/home/home.component';
import { PermissionCreateComponent } from './components/permission/permission-create/permission-create.component';
import { PermissionComponent } from './components/permission/permission.component';
import { RoleFormComponent } from './components/role/role-form/role-form.component';
import { RoleComponent } from './components/role/role.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuardIamService],
    children: [
      {
        path: 'user', canActivate: [AuthGuardIamService],
        children: [
          { path: '', component: UserComponent },
          { path: 'edit/:id', component: UserFormComponent }
        ]
      },
      {
        path: 'role', canActivate: [AuthGuardIamService],
        children: [
          { path: '', component: RoleComponent },
          { path: 'create', component: RoleFormComponent }
        ]
      },
      {
        path: 'permission', canActivate: [AuthGuardIamService],
        children: [
          { path: '', component: PermissionComponent },
          { path: 'create', component: PermissionCreateComponent }
        ]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  // otherwise redirect to login
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
