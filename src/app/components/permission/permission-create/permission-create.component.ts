import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Page } from '../../../tools/model';

@Component({
  selector: 'arlas-iam-permission-create',
  templateUrl: './permission-create.component.html',
  styleUrls: ['./permission-create.component.scss']
})
export class PermissionCreateComponent implements OnInit {

  public permForm: FormGroup;
  public pages: Page[];

  public constructor(
    private router: Router,
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.permForm = new FormGroup({
      value: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
    this.pages = [
      {label: 'Permissions', route: ['permission']  },
      {label: 'Create a permission'}
    ];
  }

  public back() {
    this.router.navigate(['permission']);
  }

  public submit() {
    this.managerService.addPermission(
      this.permForm.get('value').value,
      this.permForm.get('description').value
    ).subscribe({
      next: () => this.router.navigate(['permission'])
    });
  }

}
