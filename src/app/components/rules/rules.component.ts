import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManagerService } from '../../services/manager/manager.service';
import { RoleData, PermissionData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';
import { Page } from '../../tools/model';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { getState, saveState } from '../../tools/utils';

@Component({
  selector: 'arlas-iam-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit, OnDestroy {

  public groups: RoleData[] = [];
  public perms: PermissionData[] = [];
  public pages: Page[] = [];

  public updateLock = true;
  public showTechnicalRoles = false;

  public userSubscription: Subscription = null;

  public constructor(
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.showTechnicalRoles = getState('showTechnicalRoles');
    this.userSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.showRules();
      }
    });
    this.pages = [
      { label: marker('Rules') }
    ];
  }

  public showRules() {
    this.managerService.getOrgGroups().subscribe({
      next: roles => this.groups = roles.filter(r => (!this.showTechnicalRoles && (!r.isTechnical || r.isGroup)) || this.showTechnicalRoles)
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

  public toggleTechnicalRoles(show: boolean) {
    saveState('showTechnicalRoles', show);
    this.showTechnicalRoles = show;
    this.showRules();
  }

  public ngOnDestroy(): void {
    if (!!this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
