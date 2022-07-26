import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManagerService } from '../../services/manager/manager.service';
import { RoleData, PermissionData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'arlas-iam-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit, OnDestroy {

  public roles: RoleData[] = [];
  public perms: PermissionData[] = [];

  public userSubscription: Subscription = null;

  public constructor(
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.userSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.showRules();
      }
    });
  }

  public showRules() {
    this.managerService.getOrgRoles().subscribe({
      next: roles => this.roles = roles
    });
    this.managerService.getOrgPermissions().subscribe({
      next: perms => {
        this.perms = perms.map(perm => {
          (perm as any).roleIds = perm.roles.map(p => p.id);
          return perm;
        });
      }
    });
  }

  public ngOnDestroy(): void {
    if (!!this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
