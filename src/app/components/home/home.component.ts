import { Component, OnInit } from '@angular/core';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { ManagerService } from '../../services/manager/manager.service';
import { OrgData } from 'arlas-iam-api';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'arlas-iam-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public organisations: OrgData[] = [];

  public constructor(
    private arlasIamService: ArlasIamService,
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.managerService.getOrganisations().subscribe({
      next: orgs => {
        this.organisations = orgs;
        this.managerService.currentOrga.next(this.organisations[0].id);
      }
    });
  }

  public updateCurrentOrga(event: MatSelectChange) {
    this.managerService.currentOrga.next(event.value);
  }

  public logout() {
    this.arlasIamService.logout();
  }

}
