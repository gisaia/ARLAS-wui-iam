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
import { Router, ActivatedRoute } from '@angular/router';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ManagerService } from '@services/manager/manager.service';
import { Page } from '@tools/model';

@Component({
  selector: 'arlas-iam-role-create',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  public groupForm: FormGroup;
  public pages: Page[];

  public isCreateMode = true;
  public groupId: string = null;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.groupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
    this.pages = [
      { label: marker('Groups'), route: ['role'] },
      { label: marker('Create a group') }
    ];

    this.route.params.subscribe({
      next: params => {
        if (!!params['id']) {
          this.groupId = params['id'];
          this.isCreateMode = false;
          this.pages = [
            { label: marker('Groups'), route: ['role'] },
            { label: marker('Update a group') }
          ];
          this.managerService.getGroup(this.groupId).subscribe({
            next: role => {
              this.groupForm.get('name').setValue(role.name);
              this.groupForm.get('description').setValue(role.description);
            }
          });
        }
      }
    });

  }

  public back() {
    this.router.navigate(['role'], { queryParamsHandling: 'preserve' });
  }

  public submit() {
    if (this.isCreateMode) {
      this.managerService.addGroup(
        this.groupForm.get('name').value,
        this.groupForm.get('description').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Group created'));
          this.router.navigate(['role'], { queryParamsHandling: 'preserve' });
        }
      });
    } else {
      this.managerService.updateGroup(this.groupId,
        this.groupForm.get('name').value,
        this.groupForm.get('description').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Group updated'));
          this.router.navigate(['role'], { queryParamsHandling: 'preserve' });
        },
        error: err => this.toastr.error(err.statusText, this.translate.instant('Group not updated'))
      });
    }
  }
}
