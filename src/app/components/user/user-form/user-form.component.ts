import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Page } from '../../../tools/model';

@Component({
  selector: 'arlas-iam-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;

  public roleSubscription: Subscription = null;

  public userId = '';
  public orgRoles: RoleData[] = [];
  public userRoles: string[] = [];

  public pages: Page[] = [];

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.roleSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.managerService.getOrgRoles().subscribe({
          next: roles => this.orgRoles = roles
        });
        this.managerService.getUserRoles(this.userId).subscribe({
          next: rls => {
            this.userRoles = rls.map(r => r.id);
            this.userForm.get('roles').setValue(this.userRoles);
          }
        });
      }
    });
    this.userForm = new FormGroup({
      roles: new FormControl([], [Validators.required])
    });
    this.pages = [
      { label: 'Users', route: ['user'] },
      { label: 'Update user'}
    ];
  }

  public back() {
    this.router.navigate(['user']);
  }

  public submit() {
    this.managerService.updateRole(this.userId, this.userForm.get('roles').value).subscribe({
      next: () => this.router.navigate(['user'])
    });
  }

}
