import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OrgData, UserData } from 'arlas-iam-api';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { filter } from 'rxjs';
import { ManagerService } from '../../services/manager/manager.service';

@Component({
  selector: 'arlas-iam-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public organisations: OrgData[] = [];

  public displayDashboard = false;

  public constructor(
    private arlasIamService: ArlasIamService,
    private managerService: ManagerService,
    private translate: TranslateService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    const user: UserData = this.arlasIamService.currentUserValue?.user;
    this.managerService.getOrganisations().subscribe({
      next: orgs => {
        this.organisations = orgs.filter( o => (o as any).isOwner);
        this.organisations.map(org => org.name === user.id ? org.name = user.email.split('@')[0] : '');
        this.managerService.currentOrga.next({ id: this.organisations[0].id, name: this.organisations[0].name });
      }
    });
    if (this.router.url === '/') {
      this.displayDashboard = true;
    }
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(
      (data) => this.displayDashboard = (data as NavigationEnd).url === '/' ? true : false
    );


  }

  public updateCurrentOrga(event: MatSelectChange) {
    this.managerService.currentOrga.next({ id: event.value.id, name: event.value.name });
  }

  public logout() {
    this.arlasIamService.logout();
  }

  public navigate(route: string) {
    this.router.navigate([route]);
  }
}
