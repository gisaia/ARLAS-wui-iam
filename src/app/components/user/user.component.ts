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
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MemberData, UserData } from 'arlas-iam-api';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ManagerService } from '@services/manager/manager.service';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { Page } from '@tools/model';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { getPrivateOrgDisplayName } from '@tools/utils';

@Component({
  selector: 'arlas-iam-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  public dataSource: MatTableDataSource<MemberData>;
  public displayedColumns: string[] = ['email', 'groups', 'roles', 'updateDate', 'isOwner', 'verified', 'active', 'actions'];

  public isMyOrganisation = false;
  public pages: Page[] = [];

  public userSubscription: Subscription = null;

  public currentUser: UserData = null;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  public constructor(
    private managerService: ManagerService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    public arlasIamService: ArlasIamService
  ) { }

  public ngOnInit(): void {
    this.currentUser = this.arlasIamService.user;
    this.userSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.showUsers();
        this.isMyOrganisation = org.displayName === getPrivateOrgDisplayName(this.currentUser.email);
      }
    });
    this.pages = [
      { label: marker('Users') }
    ];
  }

  public showUsers() {
    this.managerService.getOrgUsers().subscribe({
      next: users => {
        this.dataSource = new MatTableDataSource(users.map((user, i) => {
          (user as any).groups = user.member.roles
            .filter(r => r.isGroup)
            .map(r => r.name)
            .sort(this._sortAlphabetically);
          (user as any).roles = user.member.roles
            .filter(r => !r.isGroup)
            .map(r => r.name)
            .sort(this._sortAlphabetically);
          (user as any).email = user.member.email;
          (user as any).updateDate = user.member.updateDate;
          (user as any).isActive = user.member.isActive;
          (user as any).isVerified = user.member.isVerified;
          return user as MemberData;
        })) as MatTableDataSource<MemberData>;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  private _sortAlphabetically(termaA: string, termB: string){
    if(termaA < termB) {
      return -1;
    }
    if(termaA > termB) {
      return 1;
    }
    return 0;
  }

  public add() {
    this.router.navigate(['user', 'create'], { queryParamsHandling: 'preserve' });
  }

  public editUser(userId: string): void {
    this.router.navigate(['user', 'edit', userId], { queryParamsHandling: 'preserve' });
  }

  public removeUser(userId: string): void {
    this.managerService.removeUserFromOrg(userId).subscribe({
      next: () => {
        this.showUsers();
        this.toastr.success(this.translate.instant('User removed'));
      }
    });
  }

  public ngOnDestroy(): void {
    if (!!this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
