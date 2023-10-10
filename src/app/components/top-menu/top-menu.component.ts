import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Page } from '../../tools/model';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'arlas-iam-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  @Input() public showCreate = false;
  @Input() public showSpinner = false;
  @Input() public showTechnical = false;
  @Input() public showTechnicalState = false;
  @Input() public pages: Page[] = [];
  @Input() public createText = marker('Add');

  @Output() public createEvent = new Subject<boolean>();
  @Output() public technicalRolesEvent = new Subject<boolean>();

  public constructor(
    private router: Router
  ) { }

  public ngOnInit(): void {
  }

  public addEvent() {
    this.createEvent.next(true);
  }

  public emitTechnical(event: MatCheckboxChange) {
    this.technicalRolesEvent.next(event.checked);
  }

  public navigateTo(route: string[]) {
    this.router.navigate(route, { queryParamsHandling: 'preserve' });
  }

}
