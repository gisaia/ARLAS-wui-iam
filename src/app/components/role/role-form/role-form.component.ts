import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerService } from '../../../services/manager/manager.service';

@Component({
  selector: 'arlas-iam-role-create',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  public roleForm: FormGroup;

  public constructor(
    private router: Router,
    private managerService: ManagerService
  ) { }

  public ngOnInit(): void {
    this.roleForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }

  public back() {
    this.router.navigate(['role']);
  }

  public submit() {
    this.managerService.addRole(
      this.roleForm.get('name').value,
      this.roleForm.get('description').value
    ).subscribe({
      next: () => this.router.navigate(['role'])
    });
  }
}
