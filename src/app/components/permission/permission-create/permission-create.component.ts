import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerService } from 'src/app/services/manager/manager.service';

@Component({
  selector: 'arlas-iam-permission-create',
  templateUrl: './permission-create.component.html',
  styleUrls: ['./permission-create.component.scss']
})
export class PermissionCreateComponent implements OnInit {

  public permForm: FormGroup;

  public constructor(
    private router: Router,
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.permForm = new FormGroup({
      value: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
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
