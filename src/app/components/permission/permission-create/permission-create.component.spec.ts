import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { MockToastrService } from '@tools/mock';
import { ToastrService } from 'ngx-toastr';
import { PermissionCreateComponent } from './permission-create.component';

describe('PermissionCreateComponent', () => {
  let component: PermissionCreateComponent;
  let fixture: ComponentFixture<PermissionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermissionCreateComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
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
    fixture = TestBed.createComponent(PermissionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
