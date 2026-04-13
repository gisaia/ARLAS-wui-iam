import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MatDialogModule } from '@angular/material/dialog';
import { RoleNamePipe } from '@app/pipe/role-name.pipe';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ManagerService } from '@services/manager/manager.service';
import { MockManagerService, MockToastrService } from '@tools/mock';
import { ToastrService } from 'ngx-toastr';
import { UserFormComponent } from './user-form.component';
describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        MatDialogModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
        RoleNamePipe,
        UserFormComponent
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
