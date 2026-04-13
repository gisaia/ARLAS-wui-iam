import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { ManagerService } from '@services/manager/manager.service';
import { MockManagerService, MockToastrService } from '@tools/mock';
import { ToastrService } from 'ngx-toastr';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAddComponent } from './user-add.component';

describe('UserAddComponent', () => {
    let component: UserAddComponent;
    let fixture: ComponentFixture<UserAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } }),
                UserAddComponent
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
        fixture = TestBed.createComponent(UserAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
