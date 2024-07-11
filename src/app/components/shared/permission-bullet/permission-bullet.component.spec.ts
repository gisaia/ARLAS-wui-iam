import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionBulletComponent } from './permission-bullet.component';

describe('PermissionBulletComponent', () => {
  let component: PermissionBulletComponent;
  let fixture: ComponentFixture<PermissionBulletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionBulletComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PermissionBulletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
