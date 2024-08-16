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
import { Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TranslateService } from '@ngx-translate/core';
import { ManagerService } from '@services/manager/manager.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'arlas-iam-rules-item',
  templateUrl: './rules-item.component.html',
  styleUrls: ['./rules-item.component.scss']
})
export class RulesItemComponent implements OnInit {

  @Input() public checked: boolean;
  @Input() public disabled: boolean;
  @Input() public roleId: string;
  @Input() public permId: string;

  public isLoading = false;

  public constructor(
    private managerService: ManagerService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  public ngOnInit(): void {
  }

  public change(event: MatCheckboxChange): void {
    this.isLoading = true;
    if (event.checked) {
      setTimeout(() =>
        this.managerService.addPermissionToRole(this.roleId, this.permId)
          .subscribe({
            next: () => {
              this.toastr.success(this.translate.instant('Permission updated'));
            },
            error: (err) => {
              this.toastr.error(err.message);
            },
            complete: () => {
              this.isLoading = false;
              this.checked = true;
            }
          }), 500
      );
    } else {
      setTimeout(() =>
        this.managerService.removePermissionFromRole(this.roleId, this.permId).subscribe({
          next: () => {
            this.toastr.success(this.translate.instant('Permission updated'));
          },
          error: (err) => {
            this.toastr.error(err.message);
          },
          complete: () => {
            this.isLoading = false;
            this.checked = false;
          }
        }), 500
      );
    }
  }

}
