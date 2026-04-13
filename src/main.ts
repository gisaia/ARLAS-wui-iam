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
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, forwardRef, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ArlasTranslateLoader } from '@tools/customLoader';
import { OAuthModule } from 'angular-oauth2-oidc';
import {
    ArlasCollaborativesearchService, ArlasConfigurationDescriptor, ArlasIamService, ArlasSettingsService,
    ArlasStartupService, ArlasToolkitSharedModule, AuthentificationService, CONFIG_UPDATER, FETCH_OPTIONS,
    GET_OPTIONS, LoginModule, PersistenceService, configUpdaterFactory, getOptionsFactory
} from 'arlas-wui-toolkit';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { IamStartupService } from './app/services/startup/startup.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            BrowserAnimationsModule,
            AppRoutingModule,
            ArlasToolkitSharedModule,
            LoginModule,
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
        ),
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
        provideAppInitializer(() => inject(IamStartupService).load()),
        AuthentificationService,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
