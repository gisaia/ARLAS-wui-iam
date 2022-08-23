import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { Page } from '../../../tools/model';

@Component({
  selector: 'arlas-iam-permission-create',
  templateUrl: './permission-create.component.html',
  styleUrls: ['./permission-create.component.scss']
})
export class PermissionCreateComponent implements OnInit {

  public permForm: FormGroup;
  public pages: Page[];

  public isCreateMode = true;
  public permId: string = null;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.permForm = new FormGroup({
      value: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
    this.pages = [
      { label: marker('Permissions'), route: ['permission'] },
      { label: marker('Create a permission') }
    ];

    this.route.params.subscribe({
      next: params => {
        if (!!params['id']) {
          this.permId = params['id'];
          this.isCreateMode = false;
          this.pages = [
            { label: marker('Permissions'), route: ['role'] },
            { label: marker('Update a permission') }
          ];
          this.managerService.getPermission(this.permId).subscribe({
            next: role => {
              this.permForm.get('value').setValue(role.value);
              this.permForm.get('description').setValue(role.description);
            }
          });
        }
      }
    });
  }

  public back() {
    this.router.navigate(['permission']);
  }

  public submit() {
    if (this.isCreateMode) {
      this.managerService.addPermission(
        this.permForm.get('value').value,
        this.permForm.get('description').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Permission created'));
          this.router.navigate(['permission']);
        },
        error: err => {
          this.toastr.error(err.statusText, this.translate.instant('Permission not created'));
        }
      });
    } else {
      this.managerService.updatePermission(this.permId,
        this.permForm.get('value').value,
        this.permForm.get('description').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Permission updated'));
          this.router.navigate(['permission']);
        },
        error: err => this.toastr.error(err.statusText, this.translate.instant('Permission not updated'))
      });
    }
  }

}
