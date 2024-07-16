import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'arlas-permission-legend',
  templateUrl: './permission-legend.component.html',
  styleUrls: ['./permission-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionLegendComponent  {

  public constructor() { }
}
