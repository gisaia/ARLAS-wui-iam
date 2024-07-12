import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionBulletComponent } from './permission-bullet.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('PermissionBulletComponent', () => {
  let component: PermissionBulletComponent;
  let fixture: ComponentFixture<PermissionBulletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionBulletComponent ],
      imports: [ TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),]
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
