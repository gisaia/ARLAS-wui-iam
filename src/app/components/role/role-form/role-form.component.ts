import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ManagerService } from '../../../services/manager/manager.service';
import { Page } from '../../../tools/model';

@Component({
  selector: 'arlas-iam-role-create',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  public roleForm: FormGroup;
  public pages: Page[];

  public isCreateMode = true;
  public roleId: string = null;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.roleForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
    this.pages = [
      { label: marker('Roles'), route: ['role'] },
      { label: marker('Create a role') }
    ];

    this.route.params.subscribe({
      next: params => {
        if (!!params['id']) {
          this.roleId = params['id'];
          this.isCreateMode = false;
          this.pages = [
            { label: marker('Roles'), route: ['role'] },
            { label: marker('Update a role') }
          ];
          this.managerService.getRole(this.roleId).subscribe({
            next: role => {
              this.roleForm.get('name').setValue(role.name);
              this.roleForm.get('description').setValue(role.description);
            }
          });
        }
      }
    });

  }

  public back() {
    this.router.navigate(['role']);
  }

  public submit() {
    if (this.isCreateMode) {
      this.managerService.addRole(
        this.roleForm.get('name').value,
        this.roleForm.get('description').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Role created'));
          this.router.navigate(['role']);
        }
      });
    } else {
      this.managerService.updateRole(this.roleId,
        this.roleForm.get('name').value,
        this.roleForm.get('description').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Role updated'));
          this.router.navigate(['role']);
        },
        error: err => this.toastr.error(err.statusText, this.translate.instant('Role not updated'))
      });
    }
  }
}
