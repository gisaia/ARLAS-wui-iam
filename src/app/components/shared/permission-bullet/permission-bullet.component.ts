import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'arlas-permission-bullet',
  templateUrl: './permission-bullet.component.html',
  styleUrls: ['./permission-bullet.component.scss']
})
export class PermissionBulletComponent implements OnInit {
  public color= '';
  public message= '';
  private _colors: string[] = ['#FFC522', '#FF225B', 'grey'];

  @Input() public permissionValue: string;
  @Input() public size = '10px';
  @Input() public index: number;
  @Input() public mode: 'text' | 'index'= 'text';
  @Input() public set colors(colors: string[]){
    if(Array.isArray(colors)){
      this._colors = colors;
    }
  };

  public get colors(): string[] {
    return this._colors;
  };
  public constructor() { }

  public ngOnInit(): void {
    if(this.mode === 'text'){
      this._selectIndexByText();
      this.color = this.colors[this.index];
    } else {
      this.color = this.colors[this.index];
    }
  }

  private _selectIndexByText(): void {
    if(!this.permissionValue) {
      return;
    }
    if(this.permissionValue.startsWith('h:column-filter:')) {
      this.index = 0;
    } else if (this.permissionValue.startsWith('h:partition-filter:')){
      this.index =  1;
    } else {
      this.index =  2;
    }
  }
}
