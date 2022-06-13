import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateModule, TranslateService, TranslateLoader,
  TranslateFakeLoader, TranslateStore
} from '@ngx-translate/core';
import { ArlasSettingsService } from 'arlas-wui-toolkit';

describe('IamStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [

        ArlasSettingsService,
        TranslateService, TranslateStore,
      ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ]
    });
  });

  it('should be created', (() => {
    const service: IamStartupService = TestBed.get(IamStartupService);
    expect(service).toBeTruthy();
  }));
});
