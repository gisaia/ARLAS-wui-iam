import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionLegendComponent } from './permission-legend.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('PermissionLegendComponent', () => {
  let component: PermissionLegendComponent;
  let fixture: ComponentFixture<PermissionLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionLegendComponent ],
      imports: [ TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PermissionLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
