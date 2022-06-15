import { Injectable } from '@angular/core';
import { MemberData, OrgData, RoleData } from 'arlas-iam-api';
import { ArlasIamApi } from 'arlas-wui-toolkit';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private options = {};
  private arlasIamApi: ArlasIamApi;

  public currentOrga = new BehaviorSubject<string>(null);

  public constructor() { }

  public setOptions(options: any): void {
    this.options = options;
  }

  public setArlasIamApi(api: ArlasIamApi) {
    this.arlasIamApi = api;
  }

  public getOrganisations(): Observable<OrgData[]> {
    return from(this.arlasIamApi.getOrganisations(this.options));
  }

  /** USERS **/
  public getOrgUsers(orgId: string): Observable<MemberData[]> {
    return from(this.arlasIamApi.getUsers(orgId, this.options));
  }

  /** ROLES **/
  public getOrgRoles(orgId: string): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRolesOfOrganisation(orgId, this.options));
  }

  /** PERMISSIONS **/
  public getOrgPermissions(orgId: string){
    return from(this.arlasIamApi.getPermissionsOfOrganisation(orgId, this.options));
  }
}
