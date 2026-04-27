import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { MockToastrService } from '@tools/mock';
import { ToastrService } from 'ngx-toastr';
import { beforeEach, describe, expect, it } from 'vitest';
import { RoleComponent } from './role.component';

describe('RoleComponent', () => {
    let component: RoleComponent;
    let fixture: ComponentFixture<RoleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                RouterModule.forRoot([]),
                RoleComponent
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
        fixture = TestBed.createComponent(RoleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
