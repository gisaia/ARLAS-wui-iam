import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PermissionData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';
import { ManagerService } from 'src/app/services/manager/manager.service';

@Component({
  selector: 'arlas-iam-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  public dataSource: MatTableDataSource<PermissionData>;
  public displayedColumns: string[] = ['value', 'description'];

  public permSubscription: Subscription = null;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  public constructor(
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.permSubscription = this.managerService.currentOrga.subscribe(orgId => {
      if (!!orgId) {
        this.showPerms(orgId);
      }
    });
  }

  public showPerms(orgId: string) {
    this.managerService.getOrgPermissions(orgId).subscribe({
      next: perms => {
        this.dataSource = new MatTableDataSource(perms);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public ngOnDestroy(): void {
    if (!!this.permSubscription) {
      this.permSubscription.unsubscribe();
    }
  }

}
