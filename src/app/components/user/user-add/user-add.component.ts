import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith, switchMap, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { RoleData } from 'arlas-iam-api';
import { Page } from '@tools/model';
import { ManagerService } from '@services/manager/manager.service';

@Component({
  selector: 'arlas-iam-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit, OnDestroy {

  public userForm: FormGroup;

  public pages: Page[] = [];
  public orgRoles: RoleData[] = [];
  public orgGroups: RoleData[] = [];

  public filteredEmails: Observable<string[]>;
  public orgSubscription: Subscription = null;

  public constructor(
    private router: Router,
    private managerService: ManagerService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      roles: new FormControl([], [Validators.required]),
      groups: new FormControl([], [Validators.required])
    });
    this.pages = [
      { label: marker('Users'), route: ['user'] },
      { label: marker('Invite user to organisation') }
    ];
    this.filteredEmails = this.userForm.get('email').valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val =>
        this.filter(val || '')
      )
    );
    this.orgSubscription = this.managerService.currentOrga.subscribe(org => {
      if (!!org) {
        this.managerService.getOrgRoles().subscribe(roles => this.orgRoles = roles);
        this.managerService.getOrgGroups().subscribe(groups => this.orgGroups = groups);
      }
    });
  }

  public ngOnDestroy(): void {
    if (!!this.orgSubscription) {
      this.orgSubscription.unsubscribe();
    }
  }

  public back() {
    this.router.navigate(['user'], { queryParamsHandling: 'preserve' });
  }

  public submit() {
    this.managerService.addUserToOrg({
      email: this.userForm.get('email').value,
      rids: [...this.userForm.get('roles').value.map((r: RoleData) => r.id), ...this.userForm.get('groups').value.map((g: RoleData) => g.id)]
    }).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('User added'));
        this.router.navigate(['user'], { queryParamsHandling: 'preserve' });
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastr.error(this.translate.instant('User not found'));
        }
        if (err.status === 400) {
          this.toastr.error(this.translate.instant('User is already in organisation'));
        }
      }
    });
  }

  public filter(val: string): Observable<string[]> {
    return this.managerService.getOrgEmails()
      .pipe(
        map(response => response
          .filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0
          ))
      );
  }

}
