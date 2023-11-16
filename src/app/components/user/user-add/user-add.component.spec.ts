import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { UserAddComponent } from './user-add.component';
import { MockManagerService, MockToastrService } from '@tools/mock';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ManagerService } from '@services/manager/manager.service';

describe('UserAddComponent', () => {
  let component: UserAddComponent;
  let fixture: ComponentFixture<UserAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatAutocompleteModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [UserAddComponent],
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
    fixture = TestBed.createComponent(UserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
