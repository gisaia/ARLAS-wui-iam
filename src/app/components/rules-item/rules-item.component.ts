import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ManagerService } from '../../services/manager/manager.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'arlas-iam-rules-item',
  templateUrl: './rules-item.component.html',
  styleUrls: ['./rules-item.component.scss']
})
export class RulesItemComponent implements OnInit {

  @Input() public checked: boolean;
  @Input() public disabled: boolean;
  @Input() public roleId: string;
  @Input() public permId: string;

  public isLoading = false;

  public constructor(
    private managerService: ManagerService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  public ngOnInit(): void {
  }

  public change(event: MatCheckboxChange): void {
    this.isLoading = true;
    if (event.checked) {
      setTimeout(() =>
        this.managerService.addPermissionToRole(this.roleId, this.permId)
          .subscribe({
            next: () => {
              this.toastr.success(this.translate.instant('Permission updated'));
            },
            error: (err) => {
              this.toastr.error(err.message);
            },
            complete: () => {
              this.isLoading = false;
              this.checked = true;
            }
          }), 500
      );
    } else {
      setTimeout(() =>
        this.managerService.removePermissionFromRole(this.roleId, this.permId).subscribe({
          next: () => {
            this.toastr.success(this.translate.instant('Permission updated'));
          },
          error: (err) => {
            this.toastr.error(err.message);
          },
          complete: () => {
            this.isLoading = false;
            this.checked = false;
          }
        }), 500
      );
    }
  }

}
