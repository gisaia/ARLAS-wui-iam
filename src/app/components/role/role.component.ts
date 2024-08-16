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
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ConfirmModalComponent } from '@components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ManagerService } from '@services/manager/manager.service';
import { Page } from '@tools/model';
import { RoleData } from 'arlas-iam-api';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'arlas-iam-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  public dataSource: MatTableDataSource<RoleData>;
  public displayedColumns: string[] = ['name', 'description', 'actions'];

  public roleSubscription: Subscription = null;

  public pages: Page[];

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  public constructor(
    private managerService: ManagerService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.roleSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.showGroups();
      }
    });
    this.pages = [
      { label: marker('Groups') },
    ];
  }

  public showGroups() {
    this.managerService.getOrgGroups().subscribe({
      next: roles => {
        this.dataSource = new MatTableDataSource(roles);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public add() {
    this.router.navigate(['role', 'create'], { queryParamsHandling: 'preserve' });
  }


  public editRole(roleId: string): void {
    this.router.navigate(['role', 'edit', roleId], { queryParamsHandling: 'preserve' });
  }

  public deleteRole(roleId: string, roleName: string): void {
    this.dialog.open(
      ConfirmModalComponent,
      {
        data: {
          title: marker('Delete group'),
          message: marker('You will delete the group:'),
          param: roleName
        }
      }
    ).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.managerService.deleteGroup(roleId).subscribe({
            next: () => {
              this.toastr.success(this.translate.instant('Group deleted'));
              this.showGroups();
            },
            error: () => {
              this.toastr.error(this.translate.instant('Error during group deletion'));
            }
          });
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (!!this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

}
