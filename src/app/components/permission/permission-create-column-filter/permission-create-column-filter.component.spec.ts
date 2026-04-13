import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { MockToastrService } from '@tools/mock';
import { PermissionCreateColumnFilterComponent } from './permission-create-column-filter.component';

describe('PermissionCreateColumnFilterComponent', () => {
  let component: PermissionCreateColumnFilterComponent;
  let fixture: ComponentFixture<PermissionCreateColumnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
        PermissionCreateColumnFilterComponent,
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
