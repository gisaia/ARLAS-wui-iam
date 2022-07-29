import { Injectable } from '@angular/core';
import { MemberData, OrgData, RoleData, PermissionData, UserData, OrgUserDef } from 'arlas-iam-api';
import { ArlasIamApi } from 'arlas-wui-toolkit';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private options = {};
  private arlasIamApi: ArlasIamApi;

  public currentOrga = new BehaviorSubject<{ id: string; name: string; }>(null);

  public currentUser: UserData = null;

  public constructor() { }

  public setOptions(options: any): void {
    this.options = options;
  }

  public setArlasIamApi(api: ArlasIamApi) {
    this.arlasIamApi = api;
  }

  /** ORGA **/
  public getOrganisations(): Observable<OrgData[]> {
    return from(this.arlasIamApi.getOrganisations(this.options));
  }

  /** USERS **/
  public getOrgUsers(): Observable<MemberData[]> {
    return from(this.arlasIamApi.getUsers(this.currentOrga.getValue().id, this.options));
  }

  public getOrgUser(orgId: string, userId: string): Observable<MemberData> {
    return from(this.arlasIamApi.getUsers1(orgId, userId, this.options));
  }

  public getUser(userId: string): Observable<UserData> {
    return from(this.arlasIamApi.getUser(userId, this.options));
  }

  public getUserRoles(userId: string): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRoles(this.currentOrga.getValue().id, userId, this.options));
  }

  public addRoleToUser(userId: string, roleId: string): Observable<UserData> {
    return from(this.arlasIamApi.addRoleToUserInOrganisation(this.currentOrga.getValue().id, userId, roleId, this.options));
  }

  public removeRoleFromUser(userId: string, roleId: string): Observable<UserData> {
    return from(this.arlasIamApi.removeRoleFromUserInOrganisation(this.currentOrga.getValue().id, userId, roleId, this.options));
  }

  public updateRole(userId: string, roleList: string[]) {
    return from(this.arlasIamApi.putRoles(this.currentOrga.getValue().id, userId, { ids: roleList }, this.options));
  }

  public addUserToOrg(user: OrgUserDef): Observable<OrgData> {
    return from(this.arlasIamApi.addUserToOrganisation(this.currentOrga.getValue().id, user, this.options));
  }

  public removeUserFromOrg(userId: string): Observable<OrgData> {
    return from(this.arlasIamApi.removeUserFromOrganisation(this.currentOrga.getValue().id, userId, this.options));
  }

  /** ROLES **/
  public getOrgRoles(): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRolesOfOrganisation(this.currentOrga.getValue().id, this.options));
  }

  public addRole(name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.addRoleToOrganisation(this.currentOrga.getValue().id, { name, description }, this.options));
  }

  /** PERMISSIONS **/
  public getOrgPermissions(): Observable<PermissionData[]> {
    return from(this.arlasIamApi.getPermissionsOfOrganisation(this.currentOrga.getValue().id, this.options));
  }

  public addPermission(value: string, description: string): Observable<PermissionData> {
    return from(this.arlasIamApi.addPermission(this.currentOrga.getValue().id, { value, description }, this.options));
  }

  public addPermissionToRole(roleId: string, permId: string): Observable<RoleData> {
    return from(this.arlasIamApi.addPermissionToRole(this.currentOrga.getValue().id, roleId, permId, this.options));
  }

  public removePermissionFromRole(roleId: string, permId: string): Observable<RoleData> {
    return from(this.arlasIamApi.removePermissionFromRole(this.currentOrga.getValue().id, roleId, permId, this.options));
  }
}
