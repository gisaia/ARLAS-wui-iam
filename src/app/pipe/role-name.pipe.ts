import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleName'
})
export class RoleNamePipe implements PipeTransform {

  public transform(value: string): string {
    let newValue = value;
    if (!!value) {
      newValue = value.replace('role/arlas/', '');
    }
    return newValue;

  }

}
