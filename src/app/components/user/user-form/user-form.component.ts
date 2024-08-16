/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ConfirmModalComponent } from '@components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ManagerService } from '@services/manager/manager.service';
import { Page } from '@tools/model';
import { ARLAS_ROLE_PREFIX } from '@tools/utils';
import { RoleData, MemberData } from 'arlas-iam-api';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'arlas-iam-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;

  public roleSubscription: Subscription = null;
  public isSuperAdmin = false;

  public userId = '';
  public userEmail = '';

  public user: MemberData;

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
    private arlasIamService: ArlasIamService,
    private dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isSuperAdmin = !!this.arlasIamService.user?.roles.find(r => r.name === 'role/iam/admin');
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
            this.userForm.get('groups').setValue(this.orgGroups.filter(g => this.userGroups.map(ug => ug.id).includes(g.id)));

            this.orgRoles = data[2];
            this.user = data[3];
            this.userRoles = this.user.member.roles.filter(r => r.organisation?.id === org.id && r.name.startsWith(ARLAS_ROLE_PREFIX));
            this.userForm.get('roles').setValue(this.orgRoles.filter(r => this.userRoles.map(ur => ur.id).includes(r.id)));

            this.userEmail = this.user.member.email;
            this.userForm.get('active').setValue(data[3].member.isActive);
            this.pages = [
              { label: marker('Users'), route: ['user'] },
              { label: this.translate.instant('Update user') + ' : ' + this.userEmail }
            ];
          }
        });
      }
    });
    this.userForm = new FormGroup({
      groups: new FormControl([], [Validators.required]),
      roles: new FormControl([], [Validators.required]),
      active: new FormControl()
    });

  }

  public back() {
    this.router.navigate(['user'], { queryParamsHandling: 'preserve' });
  }

  public submit() {

    this.managerService.updateUserRole(
      this.userId,
      [...this.userForm.get('roles').value.map((r: RoleData) => r.id), ...this.userForm.get('groups').value.map((g: RoleData) => g.id)]
    ).subscribe({
      next: () => {
        const newActiveStatus = this.userForm.get('active').value;
        if (newActiveStatus !== this.user.member.isActive) {
          let userStatus$ = null;
          if (newActiveStatus) {
            userStatus$ = this.managerService.activateUser(this.userId);
          } else {
            userStatus$ = this.managerService.deactivateUser(this.userId);
          }
          userStatus$.subscribe({
            next: () => {
              this.toastr.success(this.translate.instant('User updated'));
              this.router.navigate(['user'], { queryParamsHandling: 'preserve' });
            },
            error: (err) => this.toastr.error(err.statusText, this.translate.instant('User status not updated'))
          });
        } else {
          this.toastr.success(this.translate.instant('User updated'));
          this.router.navigate(['user'], { queryParamsHandling: 'preserve' });
        }
      },
      error: (err) => this.toastr.error(err.statusText, this.translate.instant('User not updated'))
    });
  }

  public deleteAccount() {
    this.dialog.open(
      ConfirmModalComponent,
      {
        data: {
          title: marker('Delete account'),
          message: marker('You will delete the account linked to this email:'),
          param: this.userEmail
        }
      }
    ).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.managerService.deleteUser(this.userId).subscribe({
            next: (response) => {
              this.toastr.success(this.translate.instant(response.message));
              this.router.navigate(['user'], { queryParamsHandling: 'preserve' });
            },
            error: () => {
              this.toastr.error(this.translate.instant('User not deleted'));
            }
          });
        }
      }
    });
  }

}
