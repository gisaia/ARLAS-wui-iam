import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoleData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';
import { ManagerService } from '../../services/manager/manager.service';

@Component({
  selector: 'arlas-iam-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  public dataSource: MatTableDataSource<RoleData>;
  public displayedColumns: string[] = ['name', 'description'];

  public roleSubscription: Subscription = null;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  public constructor(
    private managerService: ManagerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.roleSubscription = this.managerService.currentOrga.subscribe(orgId => {
      if (!!orgId) {
        this.showRoles(orgId);
      }
    });
  }

  public showRoles(orgId: string) {
    this.managerService.getOrgRoles(orgId).subscribe({
      next: roles => {
        this.dataSource = new MatTableDataSource(roles);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public add() {
    this.router.navigate(['role', 'create']);
  }

  public ngOnDestroy(): void {
    if (!!this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

}
