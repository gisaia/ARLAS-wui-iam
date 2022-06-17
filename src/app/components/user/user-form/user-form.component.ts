import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';
import { ManagerService } from 'src/app/services/manager/manager.service';

@Component({
  selector: 'arlas-iam-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;

  public roleSubscription: Subscription = null;

  public orgRoles: RoleData[] = [];
  public userRoles: string[] = [];

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.roleSubscription = this.managerService.currentOrga.subscribe(orgId => {
      if (!!orgId) {
        this.managerService.getOrgRoles(orgId).subscribe({
          next: roles => this.orgRoles = roles
        });
        this.managerService.getUserRoles(userId).subscribe({
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
  }

  public back() {
    this.router.navigate(['user']);
  }

  public submit() {
    // TODO: call role update missing endpoint for now
  }

}
