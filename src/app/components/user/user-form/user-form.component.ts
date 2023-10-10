import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { RoleData } from 'arlas-iam-api';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Page } from '../../../tools/model';
import { ARLAS_ROLE_PREFIX } from '../../../tools/utils';

@Component({
  selector: 'arlas-iam-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;

  public roleSubscription: Subscription = null;

  public userId = '';
  public userEmail = '';
  public orgGroups: RoleData[] = [];
  public orgRoles: RoleData[] = [];
  public userGroups: RoleData[] = [];
  public userRoles: RoleData[] = [];

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
            this.userGroups = data[1];
            this.userForm.get('groups').setValue(this.orgGroups.filter( g => this.userGroups.map(ug => ug.id).includes(g.id)));

            this.orgRoles = data[2];
            this.userRoles = data[3].member.roles.filter(r => r.organisation?.id === org.id && r.name.startsWith(ARLAS_ROLE_PREFIX));
            this.userForm.get('roles').setValue(this.orgRoles.filter( r => this.userRoles.map(ur => ur.id).includes(r.id)));

            this.userEmail = data[3].member.email;
            this.pages = [
              { label: marker('Users'), route: ['user'] },
              { label: marker('Update user : ' + this.userEmail) }
            ];
          }
        });
      }
    });
    this.userForm = new FormGroup({
      groups: new FormControl([], [Validators.required]),
      roles: new FormControl([], [Validators.required])
    });

  }

  public back() {
    this.router.navigate(['user'], { queryParamsHandling: 'preserve' });
  }

  public submit() {

    this.managerService.updateUserRole(
      this.userId,
      [...this.userForm.get('roles').value.map( (r: RoleData) => r.id), ...this.userForm.get('groups').value.map((g: RoleData) => g.id)]
    ).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('User updated'));
        this.router.navigate(['user'], { queryParamsHandling: 'preserve' });
      },
      error: (err) => this.toastr.error(err.statusText, this.translate.instant('User not updated'))
    });
  }

}
