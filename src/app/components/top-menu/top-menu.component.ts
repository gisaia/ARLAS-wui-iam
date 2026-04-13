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
import { Component, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { TranslatePipe } from '@ngx-translate/core';
import { Page } from '@tools/model';
import { Subject } from 'rxjs';

@Component({
  selector: 'arlas-iam-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  imports: [
    TranslatePipe,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class TopMenuComponent {

  @Input() public showCreate = false;
  @Input() public showSpinner = false;
  @Input() public showTechnical = false;
  @Input() public showTechnicalState = false;
  @Input() public pages: Page[] = [];
  @Input() public createText = marker('Add');

  @Output() public createEvent = new Subject<boolean>();
  @Output() public technicalRolesEvent = new Subject<boolean>();

  public constructor(
    private router: Router
  ) { }

  public addEvent() {
    this.createEvent.next(true);
  }

  public emitTechnical(event: MatCheckboxChange) {
    this.technicalRolesEvent.next(event.checked);
  }

  public navigateTo(route: string[]) {
    this.router.navigate(route, { queryParamsHandling: 'preserve' });
  }

}
