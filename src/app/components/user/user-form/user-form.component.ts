import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { RoleData, MemberData, UserData } from 'arlas-iam-api';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Page } from '../../../tools/model';
import { ArlasIamService } from 'arlas-wui-toolkit';

@Component({
  selector: 'arlas-iam-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;

  public roleSubscription: Subscription = null;

  public userId = '';
  public orgGroups: RoleData[] = [];
  public orgRoles: RoleData[] = [];
  public userGroups: string[] = [];
  public userRoles: string[] = [];
  public itsMe = false;

  public pages: Page[] = [];

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private arlasIamService: ArlasIamService
  ) { }

  public ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.itsMe = this.arlasIamService.currentUserValue?.user.id === this.userId;
    this.roleSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        forkJoin([
          this.managerService.getOrgGroups(),
          this.managerService.getUserGroups(this.userId),
          this.managerService.getOrgRoles(),
          this.managerService.getOrgUser(org.id, this.userId)
        ]).subscribe({
          next: data => {
            this.orgGroups = data[0];
            this.userGroups = data[1].map(r => r.id);
            this.userForm.get('groups').setValue(this.userGroups);
            this.orgRoles = data[2];
            this.userRoles = data[3].member.roles.filter(r => r.organisation?.id === org.id && r.name.startsWith('role/arlas')).map(r => r.id);
            this.userForm.get('roles').setValue(this.userRoles);
          }
        });
      }
    });
    this.userForm = new FormGroup({
      groups: new FormControl([], [Validators.required]),
      roles: new FormControl([], [Validators.required])
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

    this.managerService.updateUserRole(
      this.userId,
      [...this.userForm.get('roles').value, ...this.userForm.get('groups').value]
    ).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('User updated'));
        this.router.navigate(['user']);
      },
      error: (err) => this.toastr.error(err.statusText, this.translate.instant('User not updated'))
    });
  }

}
