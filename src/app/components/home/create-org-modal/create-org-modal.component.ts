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
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function createOrganisationValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasArobase = value.indexOf('@') >= 0;
    return hasArobase ? { hasArobase: true } : null;
  };
}

@Component({
  selector: 'arlas-iam-create-org-modal',
  templateUrl: './create-org-modal.component.html',
  styleUrls: ['./create-org-modal.component.scss']
})
export class CreateOrgModalComponent implements OnInit {

  public createOrgForm: FormGroup;
  public constructor() { }

  public ngOnInit(): void {
    this.createOrgForm = new FormGroup({
      name: new FormControl('', [Validators.required, createOrganisationValidator()])
    });
  }


}
