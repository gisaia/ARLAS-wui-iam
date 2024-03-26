import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { OrgData, UserData } from 'arlas-iam-api';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { ManagerService } from '@services/manager/manager.service';
import { Page } from '@tools/model';
import { getPrivateOrgDisplayName } from '@tools/utils';
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
    private managerService: ManagerService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
      (data) => this.displayDashboard = ((data as NavigationEnd).url === '/' || (data as NavigationEnd).url.startsWith('/?'))
    );
    this.pages = [
      { label: marker('Profile') },
    ];
  }

  public updateCurrentOrga(org: OrgData) {
    this.managerService.currentOrga.next({ id: org.id, name: org.name, displayName: org.display_name });
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
        this.organisations = orgs.filter(o => (o as any).is_owner);
        this.organisations.forEach(org => {
          if (org.name === this.user.id) {
            org.display_name = getPrivateOrgDisplayName(this.user.email);
          }
        });
        this.allMyOrgs = orgs.map(org => {
          if (org.name === this.user.id) {
            org.display_name = getPrivateOrgDisplayName(this.user.email);
          }
          (org as any).groups = this.user.roles.filter(r => r.is_group && r.organisation.id === org.id).map(r => r.name);
          return org;
        });
        const org = this.arlasIamService.getOrganisation();
        if (!!org && !currentOrg) {
          currentOrg = this.organisations.find(o => o.name === org);
        }

        if (!!currentOrg) {
          this.managerService.currentOrga.next(
            { id: currentOrg.id, name: currentOrg.name, displayName: currentOrg.display_name }
          );
        } else {
          this.managerService.currentOrga.next(
            { id: this.organisations[0]?.id, name: this.organisations[0]?.name, displayName: this.organisations[0]?.display_name }
          );
        }

        this.currentSelectedOrg = !!currentOrg ?
          this.organisations.find(o => o.name === currentOrg.name) :
          (!!this.organisations[0] ? this.organisations[0] : null);
      }
    });
  }

  public checkOrga(): void {
    this.managerService.checkOrganisation().subscribe({
      next: org => this.domainOrgExist = org.exists
    });
  }

  public manage(org: OrgData) {
    this.managerService.currentOrga.next({ id: org.id, name: org.name, displayName: org.display_name });
    this.currentSelectedOrg = this.organisations.find(o => o.id === org.id);
    this.arlasIamService.storeOrganisation(org.name);
    this.router.navigate(['user'], { queryParams: { org: org.name } });
  }

  public logout() {
    this.arlasIamService.logout();
    this.managerService.currentOrga.next(null);
  }
}
