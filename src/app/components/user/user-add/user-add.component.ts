import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ManagerService } from 'src/app/services/manager/manager.service';

@Component({
  selector: 'arlas-iam-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  public userForm: FormGroup;
  public isOwner = false;

  public constructor(
    private router: Router,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      isOwner: new FormControl(false)
    });
  }

  public back() {
    this.router.navigate(['user']);
  }

  public submit() {
    this.managerService.addUserToOrg({
      email: this.userForm.get('email').value,
      isOwner: this.userForm.get('isOwner').value
    }).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('User added'));
        this.router.navigate(['user']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastr.error(this.translate.instant('User not found'));
        }
      }
    });
  }

}
