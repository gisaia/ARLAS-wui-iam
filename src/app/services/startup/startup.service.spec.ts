import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
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
      providers: [
        ArlasSettingsService,
        TranslateService, TranslateStore,
      ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule
      ]
    });
  });

  it('should be created', (() => {
    expect(true).toBeTruthy();
  }));
});
