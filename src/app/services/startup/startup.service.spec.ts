import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateNoOpLoader,
  TranslateService,
  TranslateStore
} from '@ngx-translate/core';
import { ArlasSettingsService } from 'arlas-wui-toolkit';

describe('IamStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
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
