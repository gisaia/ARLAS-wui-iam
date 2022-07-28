import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { OrgData } from 'arlas-iam-api';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { ManagerService } from '../../services/manager/manager.service';

@Component({
  selector: 'arlas-iam-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public organisations: OrgData[] = [];

  public constructor(
    private arlasIamService: ArlasIamService,
    private managerService: ManagerService,
    private translate: TranslateService
  ) { }

  public ngOnInit(): void {
    this.managerService.getOrganisations().subscribe({
      next: orgs => {
        this.organisations = orgs;
        this.organisations.map(org => org.name === this.arlasIamService.currentUserValue.userId ? org.name = this.translate.instant('Me') : '');
        this.managerService.currentOrga.next({ id: this.organisations[0].id, name: this.organisations[0].name });
      }
    });
  }

  public updateCurrentOrga(event: MatSelectChange) {
    this.managerService.currentOrga.next({ id: event.value.id, name: event.value.name });
  }

  public logout() {
    this.arlasIamService.logout();
  }

}
