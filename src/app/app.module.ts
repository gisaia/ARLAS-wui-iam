import { APP_INITIALIZER, NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  ArlasCollaborativesearchService, ArlasConfigurationDescriptor, ArlasIamService,
  ArlasSettingsService,
  ArlasStartupService, ArlasToolkitSharedModule, AuthentificationService,
  CONFIG_UPDATER,
  FETCH_OPTIONS, GET_OPTIONS, LoginModule, PersistenceService, configUpdaterFactory, getOptionsFactory
} from 'arlas-wui-toolkit';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { CreateOrgModalComponent } from './components/home/create-org-modal/create-org-modal.component';
import { HomeComponent } from './components/home/home.component';
import {
  PermissionCreateColumnFilterComponent
} from './components/permission/permission-create-column-filter/permission-create-column-filter.component';
import { PermissionCreateComponent } from './components/permission/permission-create/permission-create.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { OAuthModule } from 'angular-oauth2-oidc';
import { PermissionComponent } from './components/permission/permission.component';
import { RoleFormComponent } from './components/role/role-form/role-form.component';
import { RoleComponent } from './components/role/role.component';
import { RulesItemComponent } from './components/rules-item/rules-item.component';
import { RulesComponent } from './components/rules/rules.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { UserComponent } from './components/user/user.component';
import { IamStartupService } from './services/startup/startup.service';
import { ArlasTranslateLoader } from '@tools/customLoader';

export function startupServiceFactory(startup: IamStartupService) {
  const load = () => startup.load();
  return load;
}

export function auhtentServiceFactory(service: AuthentificationService) {
  return service;
}

@NgModule({
  declarations: [
    AppComponent,
    ConfirmModalComponent,
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
    RulesItemComponent,
    PermissionCreateColumnFilterComponent,
    CreateOrgModalComponent
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
    MatDialogModule,
    MatToolbarModule,
    MatTooltipModule,
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
        useClass: ArlasTranslateLoader,
        deps: [HttpClient, ArlasSettingsService, PersistenceService]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    }),
    OAuthModule.forRoot()
  ],
  providers: [
    forwardRef(() => ArlasConfigurationDescriptor),
    forwardRef(() => ArlasCollaborativesearchService),
    forwardRef(() => ArlasStartupService),
    { provide: FETCH_OPTIONS, useValue: {} },
    {
      provide: GET_OPTIONS,
      useFactory: getOptionsFactory,
      deps: [ArlasSettingsService, AuthentificationService, ArlasIamService]
    },
    {
      provide: CONFIG_UPDATER,
      useValue: configUpdaterFactory
    },
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [IamStartupService],
      multi: true
    },
    {
      provide: 'AuthentificationService',
      useFactory: auhtentServiceFactory,
      deps: [AuthentificationService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
