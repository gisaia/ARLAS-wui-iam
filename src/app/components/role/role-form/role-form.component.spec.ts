import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { MockToastrService } from '@tools/mock';
import { ToastrService } from 'ngx-toastr';
import { beforeEach, describe, expect, it } from 'vitest';
import { RoleFormComponent } from './role-form.component';

describe('RoleCreateComponent', () => {
    let component: RoleFormComponent;
    let fixture: ComponentFixture<RoleFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                RoleFormComponent,
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
        fixture = TestBed.createComponent(RoleFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
