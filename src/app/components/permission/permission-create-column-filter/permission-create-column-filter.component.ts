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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ManagerService } from '@services/manager/manager.service';
import { Page } from '@tools/model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'arlas-iam-permission-create-column-filter',
  templateUrl: './permission-create-column-filter.component.html',
  styleUrls: ['./permission-create-column-filter.component.scss']
})
export class PermissionCreateColumnFilterComponent implements OnInit, OnDestroy {

  public permForm: FormGroup;
  public pages: Page[];
  public collections: string[];

  public isCreateMode = true;
  public permId: string = null;

  public collectionsSubscription: Subscription = null;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.collectionsSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.getCollections();
      }
    });

    this.permForm = new FormGroup({
      collections: new FormControl('', [Validators.required])
    });
    this.pages = [
      { label: marker('Permissions'), route: ['permission'] },
      { label: marker('Create a permission') }
    ];

    this.route.params.subscribe({
      next: params => {
        if (!!params['id']) {
          this.permId = params['id'];
          this.isCreateMode = false;
          this.pages = [
            { label: marker('Permissions'), route: ['permission'] },
            { label: marker('Update a permission') }
          ];
          this.managerService.getColumnFilterPermision(this.permId).subscribe({
            next: collections => {
              this.permForm.get('collections').setValue(collections);
            }
          });
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (!!this.collectionsSubscription) {
      this.collectionsSubscription.unsubscribe();
    }
  }

  public getCollections() {
    this.managerService.getCollections().subscribe({
      next: (cls) => {
        this.collections = cls;
      }
    });
  }

  public back() {
    this.router.navigate(['permission'], { queryParamsHandling: 'preserve' });
  }

  public submit() {
    if (this.isCreateMode) {
      this.managerService.createColumnFilterPermission(
        this.permForm.get('collections').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Permission created'));
          this.router.navigate(['permission'], { queryParamsHandling: 'preserve' });
        },
        error: err => {
          this.toastr.error(err.statusText, this.translate.instant('Permission not created'));
        }
      });
    } else {
      this.managerService.updateColumnFilterPermission(this.permId,
        this.permForm.get('collections').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Permission updated'));
          this.router.navigate(['permission'], { queryParamsHandling: 'preserve' });
        },
        error: err => this.toastr.error(err.statusText, this.translate.instant('Permission not updated'))
      });
    }
  }

}
