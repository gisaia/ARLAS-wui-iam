import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MemberData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';
import { ManagerService } from '../../services/manager/manager.service';

@Component({
  selector: 'arlas-iam-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  public dataSource: MatTableDataSource<MemberData>;
  public displayedColumns: string[] = ['id', 'email', 'isOwner', 'actions'];

  public userSubscription: Subscription = null;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  public constructor(
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.userSubscription = this.managerService.currentOrga.subscribe(orgId => {
      if (!!orgId) {
        this.showUsers(orgId);
      }
    });
  }

  public showUsers(orgId: string) {
    this.managerService.getOrgUsers(orgId).subscribe({
      next: users => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public ngOnDestroy(): void {
    if (!!this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
