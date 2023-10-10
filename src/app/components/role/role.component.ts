import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { RoleData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';
import { ManagerService } from '../../services/manager/manager.service';
import { Page } from '../../tools/model';
import { getState, saveState } from '../../tools/utils';

@Component({
  selector: 'arlas-iam-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  public dataSource: MatTableDataSource<RoleData>;
  public displayedColumns: string[] = ['name', 'description', 'actions'];

  public roleSubscription: Subscription = null;

  public pages: Page[];

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  public constructor(
    private managerService: ManagerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.roleSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.showGroups();
      }
    });
    this.pages = [
      { label: marker('Groups') },
    ];
  }

  public showGroups() {
    this.managerService.getOrgGroups().subscribe({
      next: roles => {
        this.dataSource = new MatTableDataSource(roles);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public add() {
    this.router.navigate(['role', 'create'], { queryParamsHandling: 'preserve' });
  }


  public editRole(roleId: string): void {
    this.router.navigate(['role', 'edit', roleId], { queryParamsHandling: 'preserve' });
  }

  public ngOnDestroy(): void {
    if (!!this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

}
