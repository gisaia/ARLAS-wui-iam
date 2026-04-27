import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ManagerService } from '@services/manager/manager.service';
import { MockManagerService, MockToastrService } from '@tools/mock';
import { OAuthModule } from 'angular-oauth2-oidc';
import {
    ArlasCollaborativesearchService, ArlasConfigService, ArlasConfigurationUpdaterService, ArlasIamService, ArlasStartupService
} from 'arlas-wui-toolkit';
import { ToastrService } from 'ngx-toastr';
import { beforeEach, describe, expect, it } from 'vitest';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                OAuthModule.forRoot()
            ],
            providers: [
                {
                    provide: ManagerService,
                    useClass: MockManagerService
                },
                {
                    provide: ToastrService,
                    useClass: MockToastrService
                },
                ArlasIamService,
                ArlasConfigService, ArlasCollaborativesearchService,
                {
                    provide: ArlasStartupService,
                    useClass: ArlasStartupService,
                    deps: [ArlasConfigurationUpdaterService]
                },
                {
                    provide: ArlasConfigurationUpdaterService,
                    useClass: ArlasConfigurationUpdaterService
                }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
