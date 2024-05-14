import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PermissionData } from 'arlas-iam-api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Page } from '@tools/model';
import { ManagerService } from '@services/manager/manager.service';
import { ConfirmModalComponent } from '@components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

export const DEFAULT_PERM_VALUE = 'h:column-filter:*:*';

@Component({
  selector: 'arlas-iam-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  public dataSource: MatTableDataSource<PermissionData>;
  public displayedColumns: string[] = ['value', 'description', 'actions'];

  public permSubscription: Subscription = null;
  public pages: Page[];
  public DEFAULT_PERM_VALUE = DEFAULT_PERM_VALUE;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  public constructor(
    private managerService: ManagerService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.permSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.showPerms();
      }
    });
    this.pages = [
      { label: marker('Permissions') },
    ];
  }

  public showPerms() {
    this.managerService.getOrgPermissions().subscribe({
      next: perms => {
        this.dataSource = new MatTableDataSource(perms);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public add() {
    this.router.navigate(['permission', 'create'], { queryParamsHandling: 'preserve' });
  }

  public edit(permId: string) {
    this.router.navigate(['permission', 'edit', permId], { queryParamsHandling: 'preserve' });
  }

  public deletePerm(permId: string, permName: string): void {
    this.dialog.open(
      ConfirmModalComponent,
      {
        data: {
          title: marker('Delete permission'),
          message: marker('You will delete the permission:'),
          param: permName
        }
      }
    ).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.managerService.deletePermission(permId).subscribe({
            next: () => {
              this.toastr.success(this.translate.instant('Permission deleted'));
              this.showPerms();
            },
            error: () => {
              this.toastr.error(this.translate.instant('Error during permission deletion'));
            }
          });
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (!!this.permSubscription) {
      this.permSubscription.unsubscribe();
    }
  }

}
