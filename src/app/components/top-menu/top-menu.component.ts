import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'arlas-iam-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  @Input()  public showCreate = true;
  @Input()  public showSpinner = false;
  @Input()  public page = '';

  public constructor() { }

  public ngOnInit(): void {
  }

}
