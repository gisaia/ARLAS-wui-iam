import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionLegendComponent } from './permission-legend.component';

describe('PermissionLegendComponent', () => {
  let component: PermissionLegendComponent;
  let fixture: ComponentFixture<PermissionLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionLegendComponent ]
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
