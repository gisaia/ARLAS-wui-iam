import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
      name: new FormControl('', [Validators.required])
    });
  }

}
