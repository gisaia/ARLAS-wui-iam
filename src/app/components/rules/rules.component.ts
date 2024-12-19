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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { ManagerService } from '@services/manager/manager.service';
import { Page } from '@tools/model';
import { getState, saveState } from '@tools/utils';
import { PermissionData, RoleData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'arlas-iam-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit, OnDestroy {

  public groups: RoleData[] = [];
  public perms: PermissionData[] = [];
  public pages: Page[] = [];

  public updateLock = true;
  public showTechnicalRoles = false;

  public userSubscription: Subscription = null;

  public constructor(
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.showTechnicalRoles = getState('showTechnicalRoles');
    this.userSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.showRules();
      }
    });
    this.pages = [
      { label: marker('Rules') }
    ];
  }

  public showRules() {
    this.managerService.getOrgGroups().subscribe({
      next: roles => this.groups = roles.filter(r => (!this.showTechnicalRoles && (!r.isTechnical || r.isGroup)) || this.showTechnicalRoles)
    });
    this.managerService.getOrgPermissions().subscribe({
      next: perms => {
        this.perms = perms.map(perm => {
          (perm as any).roleIds = perm.roles.map(p => p.id);
          return perm;
        });
      }
    });
  }

  public toggleTechnicalRoles(show: boolean) {
    saveState('showTechnicalRoles', show);
    this.showTechnicalRoles = show;
    this.showRules();
  }

  public ngOnDestroy(): void {
    if (!!this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
