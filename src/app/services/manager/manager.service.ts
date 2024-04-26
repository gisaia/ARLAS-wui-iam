import { Injectable } from '@angular/core';
import {
  MemberData, OrgData,
  OrgExists,
  OrgUserDef,
  PermissionData,
  RoleData,
  UpdateUserDef,
  UserData
} from 'arlas-iam-api';
import { ArlasIamApi } from 'arlas-wui-toolkit';
import { pid } from 'process';
import { BehaviorSubject, Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private options = {};
  private arlasIamApi: ArlasIamApi;

  public currentOrga = new BehaviorSubject<{ id: string; name: string; displayName: string; }>(null);
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
    return from(this.arlasIamApi.getOrganisations(this.options)).pipe(map(ar => ar.data));
  }

  public checkOrganisation(): Observable<OrgExists> {
    return from(this.arlasIamApi.checkOrganisation(this.options)).pipe(map(ar => ar.data));
  }

  public createOrganisation(name?: string): Observable<OrgData> {
    if (!!name) {
      return from(this.arlasIamApi.createOrganisationWithName(name, this.options)).pipe(map(ar => ar.data));
    } else {
      return from(this.arlasIamApi.createOrganisation(this.options)).pipe(map(ar => ar.data));
    }
  }

  public getOrgEmails(): Observable<string[]> {
    return from(this.arlasIamApi.getEmails(this.currentOrga.getValue().id, this.options)).pipe(map(ar => ar.data));
  }

  /** USERS **/
  public getOrgUsers(): Observable<MemberData[]> {
    return from(this.arlasIamApi.getUsers(this.currentOrga.getValue().id, undefined /* rname */, this.options)).pipe(map(ar => ar.data));
  }

  public getOrgUser(orgId: string, userId: string): Observable<MemberData> {
    return from(this.arlasIamApi.getUser(orgId, userId, this.options)).pipe(map(ar => ar.data));
  }

  public getUser(userId: string): Observable<UserData> {
    return from(this.arlasIamApi.readUser(userId, this.options)).pipe(map(ar => ar.data));
  }

  public getUserRoles(userId: string): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRoles(this.currentOrga.getValue().id, userId, this.options)).pipe(map(ar => ar.data));
  }

  public getUserGroups(userId: string): Observable<RoleData[]> {
    return from(this.arlasIamApi.getGroups(this.currentOrga.getValue().id, userId, this.options)).pipe(map(ar => ar.data));
  }

  public addRoleToUser(userId: string, roleId: string): Observable<UserData> {
    return from(this.arlasIamApi.addRoleToUserInOrganisation(this.currentOrga.getValue().id, userId, roleId, this.options))
      .pipe(map(ar => ar.data));
  }

  public removeRoleFromUser(userId: string, roleId: string): Observable<UserData> {
    return from(this.arlasIamApi.removeRoleFromUserInOrganisation(this.currentOrga.getValue().id, userId, roleId, this.options))
      .pipe(map(ar => ar.data));
  }

  public updateUser(userId: string, userDef: UpdateUserDef): Observable<UserData> {
    return from(this.arlasIamApi.updateUser(userDef, userId, this.options))
      .pipe(map(ar => ar.data));
  }

  public updateUserRole(userId: string, roleList: string[]) {
    return from(this.arlasIamApi.putRoles({ ids: roleList }, this.currentOrga.getValue().id, userId, this.options)).pipe(map(ar => ar.data));
  }

  public addUserToOrg(user: OrgUserDef): Observable<OrgData> {
    return from(this.arlasIamApi.addUserToOrganisation(user, this.currentOrga.getValue().id, this.options)).pipe(map(ar => ar.data));
  }

  public removeUserFromOrg(userId: string): Observable<OrgData> {
    return from(this.arlasIamApi.removeUserFromOrganisation(this.currentOrga.getValue().id, userId, this.options)).pipe(map(ar => ar.data));
  }

  /** ROLES **/
  public getOrgRoles(): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRolesOfOrganisation(this.currentOrga.getValue().id, this.options)).pipe(map(ar => ar.data));
  }

  public addRole(name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.addRoleToOrganisation({ name, description }, this.currentOrga.getValue().id, this.options))
      .pipe(map(ar => ar.data));
  }

  public updateRole(roleId: string, name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.updateRoleInOrganisation({ name, description }, this.currentOrga.getValue().id, roleId, this.options))
      .pipe(map(ar => ar.data));
  }

  public getRole(roleId: string): Observable<RoleData> {
    return from(this.arlasIamApi.getRolesOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(ar => ar.data.find(r => r.id === roleId))
    );
  }

  /** GROUPS **/
  public getOrgGroups(): Observable<RoleData[]> {
    return from(this.arlasIamApi.getGroupsOfOrganisation(this.currentOrga.getValue().id, this.options))
      .pipe(map(ar => ar.data));
  }

  public addGroup(name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.addGroupToOrganisation({ name, description }, this.currentOrga.getValue().id, this.options))
      .pipe(map(ar => ar.data));
  }

  public updateGroup(roleId: string, name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.updateGroupInOrganisation({ name, description }, this.currentOrga.getValue().id, roleId, this.options))
      .pipe(map(ar => ar.data));
  }

  public getGroup(roleId: string): Observable<RoleData> {
    return from(this.arlasIamApi.getGroupsOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(roles => roles.data.find(r => r.id === roleId))
    );
  }



  /** PERMISSIONS **/
  public getOrgPermissions(): Observable<PermissionData[]> {
    return from(this.arlasIamApi.getPermissionsOfOrganisation(this.currentOrga.getValue().id, this.options))
      .pipe(map(ar => ar.data));;
  }

  public addPermission(value: string, description: string): Observable<PermissionData> {
    return from(this.arlasIamApi.addPermission({ value, description }, this.currentOrga.getValue().id, this.options))
      .pipe(map(ar => ar.data));
  }

  public updatePermission(permId: string, value: string, description: string): Observable<PermissionData> {
    return from(this.arlasIamApi.updatePermission({ value, description }, this.currentOrga.getValue().id, permId, this.options))
      .pipe(map(ar => ar.data));
  }

  public getPermission(permId: string): Observable<PermissionData> {
    return from(this.arlasIamApi.getPermissionsOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(perms => perms.data.find(p => p.id === permId))
    );
  }

  public addPermissionToRole(roleId: string, permId: string): Observable<RoleData> {
    return from(this.arlasIamApi.addPermissionToRole(this.currentOrga.getValue().id, roleId, permId, this.options))
      .pipe(map(ar => ar.data));
  }

  public removePermissionFromRole(roleId: string, permId: string): Observable<RoleData> {
    return from(this.arlasIamApi.removePermissionFromRole(this.currentOrga.getValue().id, roleId, permId, this.options))
      .pipe(map(ar => ar.data));
  }

  /** PERMISSION COLUMN FILTER **/
  public createColumnFilterPermission(collections: string[]): Observable<PermissionData> {
    return from(this.arlasIamApi.addColumnFilterPermission(collections, this.currentOrga.getValue().id, this.options))
      .pipe(map(ar => ar.data));
  }

  public updateColumnFilterPermission(permId: string, collections: string[]): Observable<PermissionData> {
    return from(this.arlasIamApi.updateColumnFilterPermission(collections, this.currentOrga.getValue().id, permId, this.options))
      .pipe(map(ar => ar.data));;
  }

  public getColumnFilterPermision(permId: string) {
    return from(this.arlasIamApi.getCollectionsOfColumnFiltersInOrganisation(this.currentOrga.getValue().id, permId, this.options))
      .pipe(map(ar => ar.data));
  }

  public getCollections(): Observable<string[]> {
    return from(this.arlasIamApi.getOrganisationCollections(this.currentOrga.getValue().id, this.options))
      .pipe(map(ar => ar.data));
  }
}
