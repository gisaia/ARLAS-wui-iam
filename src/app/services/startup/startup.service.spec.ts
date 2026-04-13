import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ArlasSettingsService } from 'arlas-wui-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';

describe('IamStartupService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                RouterModule.forRoot([])
            ],
            providers: [
                ArlasSettingsService,
                provideHttpClient(withInterceptorsFromDi()),
            ]
        });
    });

    it('should be created', (() => {
        expect(true).toBeTruthy();
    }));
});
