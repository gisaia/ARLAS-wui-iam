import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NavigationEnd, Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { OrgData, UserData } from 'arlas-iam-api';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { ManagerService } from '../../services/manager/manager.service';
import { Page } from '../../tools/model';
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
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) { }

  public ngOnInit(): void {

    this.user = this.arlasIamService.currentUserValue?.user;
    this.isSuperAdmin = !!this.user?.roles.find(r => r.name === 'role/iam/admin');
    this.getOrganisations();
    this.checkOrga();
    if (this.router.url === '/') {
      this.displayDashboard = true;
    }
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(
      (data) => this.displayDashboard = (data as NavigationEnd).url === '/'
    );
    this.pages = [
      { label: marker('Profile') },
    ];
  }

  public updateCurrentOrga(event: OrgData) {
    this.managerService.currentOrga.next({ id: event.id, name: event.name, displayName: event.displayName });
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
        this.allMyOrgs = orgs.map(org => {
          (org as any).groups = this.user.roles.filter(r => r.isGroup && r.organisation.id === org.id).map(r => r.name);
          return org;
        });
        this.organisations = orgs.filter(o => (o as any).isOwner);
        this.organisations.map(org => org.name === this.user.id ? org.displayName = this.user.email.split('@')[0] : '');
        if (!!currentOrg) {
          this.managerService.currentOrga.next(
            { id: currentOrg.id, name: currentOrg.name, displayName: currentOrg.displayName }
          );
        } else {
          this.managerService.currentOrga.next(
            { id: this.organisations[0]?.id, name: this.organisations[0]?.name, displayName: this.organisations[0]?.displayName }
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
    this.managerService.currentOrga.next({ id: org.id, name: org.name, displayName: org.displayName });
    this.currentSelectedOrg = org;
    this.router.navigate(['user']);
  }

  public logout() {
    this.arlasIamService.logout();
    this.managerService.currentOrga.next(null);
  }

  public navigate(route: string) {
    this.router.navigate([route]);
  }
}
