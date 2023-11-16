import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserFormComponent } from './user-form.component';
import { MockManagerService, MockToastrService } from '@tools/mock';
import { ManagerService } from '@services/manager/manager.service';
describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
      ],
      providers: [
        {
          provide: ToastrService,
          useClass: MockToastrService
        },
        {
          provide: ManagerService,
          useClass: MockManagerService
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
