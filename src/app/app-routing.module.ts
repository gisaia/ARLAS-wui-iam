import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardIamService, LoginComponent } from 'arlas-wui-toolkit';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  { path: 'user', component: UserComponent, canActivate: [AuthGuardIamService]},
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'user', pathMatch: 'full'},
  // otherwise redirect to login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
