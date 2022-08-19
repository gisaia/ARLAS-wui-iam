import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { RoleData, MemberData } from 'arlas-iam-api';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Page } from '../../../tools/model';

@Component({
  selector: 'arlas-iam-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;

  public roleSubscription: Subscription = null;

  public userId = '';
  public orgRoles: RoleData[] = [];
  public userRoles: string[] = [];
  public user: MemberData;

  public pages: Page[] = [];

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.roleSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        forkJoin([
          this.managerService.getOrgRoles(),
          this.managerService.getUserRoles(this.userId),
          this.managerService.getOrgUser(org.id, this.userId)
        ]).subscribe({
          next: data => {
            this.orgRoles = data[0];
            this.userRoles = data[1].map(r => r.id);
            this.userForm.get('roles').setValue(this.userRoles);
            this.user = data[2];
            this.userForm.get('isOwner').setValue(this.user.isOwner);
          }
        });
      }
    });
    this.userForm = new FormGroup({
      roles: new FormControl([], [Validators.required]),
      isOwner: new FormControl()
    });
    this.pages = [
      { label: marker('Users'), route: ['user'] },
      { label: marker('Update user') }
    ];
  }

  public back() {
    this.router.navigate(['user']);
  }

  public submit() {

    this.managerService.updateRole(this.userId, this.userForm.get('roles').value).subscribe({
      next: () => {
        this.managerService.updateUserOwnership(this.userId, {
          isOwner: this.userForm.get('isOwner').value
        }).subscribe({
          next: () => {
            this.toastr.success(this.translate.instant('User updated'));
            this.router.navigate(['user']);

          },
          error: (err) => this.toastr.error(err, this.translate.instant('User not updated'))
        });
      },
      error: (err) => this.toastr.error(err, this.translate.instant('User not updated'))
    });
  }

}
