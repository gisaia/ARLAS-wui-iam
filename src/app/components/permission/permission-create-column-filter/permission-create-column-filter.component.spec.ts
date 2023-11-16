import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { PermissionCreateColumnFilterComponent } from './permission-create-column-filter.component';
import { MockToastrService } from '@tools/mock';

describe('PermissionCreateColumnFilterComponent', () => {
  let component: PermissionCreateColumnFilterComponent;
  let fixture: ComponentFixture<PermissionCreateColumnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermissionCreateColumnFilterComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
      ],
      providers: [
        {
          provide: ToastrService,
          useClass: MockToastrService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionCreateColumnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
