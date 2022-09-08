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

  public groupForm: FormGroup;
  public pages: Page[];

  public isCreateMode = true;
  public groupId: string = null;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.groupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
    this.pages = [
      { label: marker('Groups'), route: ['role'] },
      { label: marker('Create a group') }
    ];

    this.route.params.subscribe({
      next: params => {
        if (!!params['id']) {
          this.groupId = params['id'];
          this.isCreateMode = false;
          this.pages = [
            { label: marker('Groups'), route: ['role'] },
            { label: marker('Update a group') }
          ];
          this.managerService.getGroup(this.groupId).subscribe({
            next: role => {
              this.groupForm.get('name').setValue(role.name);
              this.groupForm.get('description').setValue(role.description);
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
      this.managerService.addGroup(
        this.groupForm.get('name').value,
        this.groupForm.get('description').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Group created'));
          this.router.navigate(['role']);
        }
      });
    } else {
      this.managerService.updateGroup(this.groupId,
        this.groupForm.get('name').value,
        this.groupForm.get('description').value
      ).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('Group updated'));
          this.router.navigate(['role']);
        },
        error: err => this.toastr.error(err.statusText, this.translate.instant('Group not updated'))
      });
    }
  }
}
