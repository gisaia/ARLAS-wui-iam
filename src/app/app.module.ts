import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ArlasToolkitSharedModule, LoginModule, IamInterceptor, ArlasIamService, ArlasSettingsService } from 'arlas-wui-toolkit';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { IamStartupService } from './services/startup/startup.service';

export function startupServiceFactory(startup: IamStartupService) {
  const load = () => startup.load();
  return load;
}

@NgModule({
  declarations: [
    AppComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ArlasToolkitSharedModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    LoginModule,
    RouterModule,
    HttpClientModule
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
