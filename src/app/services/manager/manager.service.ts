import { Injectable } from '@angular/core';
import { MemberData, OrgData, RoleData, PermissionData, UserData } from 'arlas-iam-api';
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

  /** USERS **/
  public getOrganisations(): Observable<OrgData[]> {
    return from(this.arlasIamApi.getOrganisations(this.options));
  }



  /** USERS **/
  public getOrgUsers(orgId: string): Observable<MemberData[]> {
    return from(this.arlasIamApi.getUsers(orgId, this.options));
  }

  public getUserRoles(userId: string): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRoles(this.currentOrga.getValue(), userId, this.options));
  }

  public addRoleToUser(userId: string, roleId: string): Observable<UserData> {
    return from(this.arlasIamApi.addRoleToUserInOrganisation(this.currentOrga.getValue(), userId, roleId, this.options));
  }

  public removeRoleFromUser(userId: string, roleId: string): Observable<UserData> {
    return from(this.arlasIamApi.removeRoleFromUserInOrganisation(this.currentOrga.getValue(), userId, roleId, this.options));
  }

  /** ROLES **/
  public getOrgRoles(orgId: string): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRolesOfOrganisation(orgId, this.options));
  }

  public addRole(name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.addRoleToOrganisation(this.currentOrga.getValue(), { name, description }, this.options));
  }

  /** PERMISSIONS **/
  public getOrgPermissions(orgId: string): Observable<PermissionData[]> {
    return from(this.arlasIamApi.getPermissionsOfOrganisation(orgId, this.options));
  }

  public addPermission(value: string, description: string): Observable<PermissionData> {
    return from(this.arlasIamApi.addPermission(this.currentOrga.getValue(), { value, description }, this.options));
  }
}
