import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { CreateOrgModalComponent } from './create-org-modal.component';

describe('CreateOrgModalComponent', () => {
  let component: CreateOrgModalComponent;
  let fixture: ComponentFixture<CreateOrgModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateOrgModalComponent,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
