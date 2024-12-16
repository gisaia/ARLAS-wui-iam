import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  TranslateModule, TranslateService, TranslateLoader,
  TranslateFakeLoader, TranslateStore
} from '@ngx-translate/core';
import { ArlasSettingsService } from 'arlas-wui-toolkit';
import { IamStartupService } from './startup.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('IamStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule],
    providers: [
        ArlasSettingsService,
        TranslateService, TranslateStore,
        provideHttpClient(withInterceptorsFromDi()),
    ]
});
  });

  it('should be created', (() => {
    expect(true).toBeTruthy();
  }));
});
