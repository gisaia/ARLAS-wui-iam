import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ManagerService } from '@services/manager/manager.service';
import { Page } from '@tools/model';
import { getPrivateOrgDisplayName } from '@tools/utils';
import { OrgData, UserData } from 'arlas-iam-api';
import { ARLAS_ORG_FILTER, ArlasIamService, ArlasStartupService } from 'arlas-wui-toolkit';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { CreateOrgModalComponent } from './create-org-modal/create-org-modal.component';

@Component({
  selector: 'arlas-iam-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public organisations: OrgData[] = [];
  public allMyOrgs: OrgData[] = [];
  public currentSelectedOrg: OrgData = null;

  public domainOrgExist = true;
  public isSuperAdmin = false;

  public displayDashboard = false;
  public pages: Page[] = [];
  public user: UserData;

  public constructor(
    private arlasIamService: ArlasIamService,
    public managerService: ManagerService,
    private arlasStartupService: ArlasStartupService,
    private translate: TranslateService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) { }

  public ngOnInit(): void {

    this.user = this.arlasIamService.user;
    this.isSuperAdmin = !!this.user?.roles.find(r => r.name === 'role/iam/admin');
    this.getOrganisations();
    this.checkOrga();
    if (this.router.url === '/' || this.router.url.startsWith('/?')) {
      this.displayDashboard = true;
    }
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(
      (data) => {
        this.displayDashboard = ((data as NavigationEnd).url === '/' || (data as NavigationEnd).url.startsWith('/?'));
      }
    );
    this.pages = [
      { label: marker('Profile') },
    ];
  }

  public updateCurrentOrga(org: OrgData) {
    const accessToken = this.arlasIamService.getAccessToken();
    this.arlasStartupService.changeOrgHeader(org.name, accessToken);
    const iamHeader = {
      Authorization: 'Bearer ' + accessToken,
    };
    if (!!org) {
      // @ts-ignore
      iamHeader[ARLAS_ORG_FILTER] = org.name;
    }
    this.managerService.setOptions({
      headers: iamHeader
    });
    this.managerService.currentOrga.next({ id: org.id, name: org.name, displayName: org.displayName });
    this.currentSelectedOrg = org;
    this.arlasIamService.storeOrganisation(org.name);
    this.router.navigate(
      ['/'],
      {
        queryParams: { org: org.name }
      }
    );
  }

  public addOrg() {
    if (this.isSuperAdmin) {
      this.dialog.open(
        CreateOrgModalComponent
      ).afterClosed().subscribe({
        next: (name) => {
          if (name) {
            this.managerService.createOrganisation(name).subscribe({
              next: (org) => {
                this.toastr.success(this.translate.instant('Organisation created'));
                this.getOrganisations(org);
              },
              error: () => {
                this.toastr.error(this.translate.instant('An organisation with this name already exists'));
              }
            });
          }
        }
      });
    } else {
      this.dialog.open(
        ConfirmModalComponent,
        {
          data: {
            title: marker('Create organisation'),
            message: marker('You will create an organisation named:'),
            param: this.user.email.substring(this.user.email.indexOf('@') + 1)
          }
        }
      ).afterClosed().subscribe({
        next: (result) => {
          if (result) {
            this.managerService.createOrganisation().subscribe({
              next: (org) => {
                this.toastr.success(this.translate.instant('Organisation created'));
                this.getOrganisations(org);
                this.checkOrga();
              }
            });
          }
        }
      });
    }

  }

  public getOrganisations(currentOrg?: OrgData): void {
    this.managerService.getOrganisations().subscribe({
      next: orgs => {
        /** why is_owner is not part of OrgData */
        this.organisations = orgs.filter(o => (o as any).isOwner);
        this.organisations.forEach(org => {
          if (org.name === this.user.id) {
            org.displayName = getPrivateOrgDisplayName(this.user.email);
          }
        });
        this.allMyOrgs = orgs.map(org => {
          if (org.name === this.user.id) {
            org.displayName = getPrivateOrgDisplayName(this.user.email);
          }
          (org as any).groups = this.user.roles.filter(r => r.isGroup && r.organisation.id === org.id).map(r => r.name);
          return org;
        });
        const org = this.arlasIamService.getOrganisation();
        if (!!org && !currentOrg) {
          currentOrg = this.organisations.find(o => o.name === org);
        }
        this.currentSelectedOrg = !!currentOrg ?
          this.organisations.find(o => o.name === currentOrg.name) :
          (!!this.organisations[0] ? this.organisations[0] : null);
        if (!!this.currentSelectedOrg) {
          this.updateCurrentOrga(this.currentSelectedOrg);
        }

      }
    });
  }

  public checkOrga(): void {
    this.managerService.checkOrganisation().subscribe({
      next: org => this.domainOrgExist = org.exists
    });
  }

  public manage(org: OrgData) {
    this.managerService.currentOrga.next({ id: org.id, name: org.name, displayName: org.displayName });
    this.currentSelectedOrg = this.organisations.find(o => o.id === org.id);
    this.arlasIamService.storeOrganisation(org.name);
    this.router.navigate(['user'], { queryParams: { org: org.name } });
  }

  public logout() {
    this.arlasIamService.logout();
    this.managerService.currentOrga.next(null);
  }
}
