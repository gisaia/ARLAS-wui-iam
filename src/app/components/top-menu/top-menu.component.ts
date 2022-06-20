import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'arlas-iam-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  @Input() public showCreate = false;
  @Input() public showSpinner = false;
  @Input() public page = '';

  @Output() public createEvent = new Subject<boolean>();

  public constructor() { }

  public ngOnInit(): void {
  }

  public addEvent() {
    this.createEvent.next(true);
  }

}
