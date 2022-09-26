import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ArlasIamService, ArlasSettingsService, ArlasToolkitSharedModule, IamInterceptor, LoginModule } from 'arlas-wui-toolkit';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { IamStartupService } from './services/startup/startup.service';
import { RoleComponent } from './components/role/role.component';
import { PermissionComponent } from './components/permission/permission.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { RoleFormComponent } from './components/role/role-form/role-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PermissionCreateComponent } from './components/permission/permission-create/permission-create.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrModule } from 'ngx-toastr';
import { RulesComponent } from './components/rules/rules.component';
import { RulesItemComponent } from './components/rules-item/rules-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export function startupServiceFactory(startup: IamStartupService) {
  const load = () => startup.load();
  return load;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomeComponent,
    RoleComponent,
    PermissionComponent,
    TopMenuComponent,
    RoleFormComponent,
    PermissionCreateComponent,
    UserFormComponent,
    UserAddComponent,
    RulesComponent,
    RulesItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ArlasToolkitSharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    LoginModule,
    RouterModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [IamStartupService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IamInterceptor,
      deps: [ArlasIamService, ArlasSettingsService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
