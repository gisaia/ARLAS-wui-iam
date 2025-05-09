/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
import { AuthGuardOwnerService } from '@tools/auth-guard-owner.service';


const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuardIamService],
    children: [
      {
        path: 'user', canActivate: [AuthGuardOwnerService],
        children: [
          { path: '', component: UserComponent },
          { path: 'create', component: UserAddComponent },
          { path: 'edit/:id', component: UserFormComponent }
        ]
      },
      {
        path: 'role', canActivate: [AuthGuardOwnerService],
        children: [
          { path: '', component: RoleComponent },
          { path: 'create', component: RoleFormComponent },
          { path: 'edit/:id', component: RoleFormComponent }
        ]
      },
      {
        path: 'permission', canActivate: [AuthGuardOwnerService],
        children: [
          { path: '', component: PermissionComponent },
          { path: 'create', component: PermissionCreateComponent },
          { path: 'edit/:id', component: PermissionCreateComponent }
        ]
      },
      {
        path: 'rule', component: RulesComponent, canActivate: [AuthGuardOwnerService]
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
