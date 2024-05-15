import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionCreateComponent } from '@components/permission/permission-create/permission-create.component';
import { AuthGuardIamService, ForgotComponent, LoginComponent, RegisterComponent, ResetComponent, VerifyComponent } from 'arlas-wui-toolkit';
import { HomeComponent } from './components/home/home.component';
import { PermissionComponent } from './components/permission/permission.component';
import { RoleFormComponent } from './components/role/role-form/role-form.component';
import { RoleComponent } from './components/role/role.component';
import { RulesComponent } from './components/rules/rules.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
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
          { path: 'create', component: UserAddComponent },
          { path: 'edit/:id', component: UserFormComponent }
        ]
      },
      {
        path: 'role', canActivate: [AuthGuardIamService],
        children: [
          { path: '', component: RoleComponent },
          { path: 'create', component: RoleFormComponent },
          { path: 'edit/:id', component: RoleFormComponent }
        ]
      },
      {
        path: 'permission', canActivate: [AuthGuardIamService],
        children: [
          { path: '', component: PermissionComponent },
          { path: 'create', component: PermissionCreateComponent },
          { path: 'edit/:id', component: PermissionCreateComponent }
        ]
      },
      {
        path: 'rule', component: RulesComponent, canActivate: [AuthGuardIamService]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify/:id/user/:token', component: VerifyComponent },
  { path: 'password_forgot', component: ForgotComponent },
  { path: 'reset/:id/user/:token', component: ResetComponent },
  // otherwise redirect to login
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
