import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
    TopMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ArlasToolkitSharedModule,
    MatIconModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTableModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSelectModule,
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
    })
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
