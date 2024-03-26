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
import { BehaviorSubject, Observable, from } from 'rxjs';

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
    return from(this.arlasIamApi.getOrganisations(this.options));
  }

  public checkOrganisation(): Observable<OrgExists> {
    return from(this.arlasIamApi.checkOrganisation(this.options));
  }

  public createOrganisation(name?: string): Observable<OrgData> {
    if (!!name) {
      return from(this.arlasIamApi.createOrganisationWithName(name, this.options));
    } else {
      return from(this.arlasIamApi.createOrganisation(this.options));
    }
  }

  public getOrgEmails(): Observable<string[]> {
    return from(this.arlasIamApi.getEmails(this.currentOrga.getValue().id, this.options));
  }

  /** USERS **/
  public getOrgUsers(): Observable<MemberData[]> {
    return from(this.arlasIamApi.getUsers(this.currentOrga.getValue().id, undefined /* rname */, this.options));
  }

  public getOrgUser(orgId: string, userId: string): Observable<MemberData> {
    return from(this.arlasIamApi.getUser(orgId, userId, this.options));
  }

  public getUser(userId: string): Observable<UserData> {
    return from(this.arlasIamApi.readUser(userId, this.options));
  }

  public getUserRoles(userId: string): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRoles(this.currentOrga.getValue().id, userId, this.options));
  }

  public getUserGroups(userId: string): Observable<RoleData[]> {
    return from(this.arlasIamApi.getGroups(this.currentOrga.getValue().id, userId, this.options));
  }

  public addRoleToUser(userId: string, roleId: string): Observable<UserData> {
    return from(this.arlasIamApi.addRoleToUserInOrganisation(this.currentOrga.getValue().id, userId, roleId, this.options));
  }

  public removeRoleFromUser(userId: string, roleId: string): Observable<UserData> {
    return from(this.arlasIamApi.removeRoleFromUserInOrganisation(this.currentOrga.getValue().id, userId, roleId, this.options));
  }

  public updateUser(userId: string, userDef: UpdateUserDef): Observable<UserData> {
    return from(this.arlasIamApi.updateUser(userDef, userId, this.options));
  }

  public updateUserRole(userId: string, roleList: string[]) {
    return from(this.arlasIamApi.putRoles({ ids: roleList }, this.currentOrga.getValue().id, userId, this.options));
  }

  public addUserToOrg(user: OrgUserDef): Observable<OrgData> {
    return from(this.arlasIamApi.addUserToOrganisation(user, this.currentOrga.getValue().id , this.options));
  }

  public removeUserFromOrg(userId: string): Observable<OrgData> {
    return from(this.arlasIamApi.removeUserFromOrganisation(this.currentOrga.getValue().id, userId, this.options));
  }

  /** ROLES **/
  public getOrgRoles(): Observable<RoleData[]> {
    return from(this.arlasIamApi.getRolesOfOrganisation(this.currentOrga.getValue().id, this.options));
  }

  public addRole(name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.addRoleToOrganisation({ name, description }, this.currentOrga.getValue().id, this.options));
  }

  public updateRole(roleId: string, name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.updateRoleInOrganisation( { name, description }, this.currentOrga.getValue().id, roleId, this.options));
  }

  public getRole(roleId: string): Observable<RoleData> {
    return from(this.arlasIamApi.getRolesOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(roles => roles.find(r => r.id === roleId))
    );
  }

  /** GROUPS **/
  public getOrgGroups(): Observable<RoleData[]> {
    return from(this.arlasIamApi.getGroupsOfOrganisation(this.currentOrga.getValue().id, this.options));
  }

  public addGroup(name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.addGroupToOrganisation({ name, description }, this.currentOrga.getValue().id, this.options));
  }

  public updateGroup(roleId: string, name: string, description: string): Observable<RoleData> {
    return from(this.arlasIamApi.updateGroupInOrganisation({ name, description }, this.currentOrga.getValue().id, roleId, this.options));
  }

  public getGroup(roleId: string): Observable<RoleData> {
    return from(this.arlasIamApi.getGroupsOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(roles => roles.find(r => r.id === roleId))
    );
  }



  /** PERMISSIONS **/
  public getOrgPermissions(): Observable<PermissionData[]> {
    return from(this.arlasIamApi.getPermissionsOfOrganisation(this.currentOrga.getValue().id, this.options));
  }

  public addPermission(value: string, description: string): Observable<PermissionData> {
    return from(this.arlasIamApi.addPermission({ value, description }, this.currentOrga.getValue().id, this.options));
  }

  public updatePermission(permId: string, value: string, description: string): Observable<PermissionData> {
    return from(this.arlasIamApi.updatePermission( { value, description }, this.currentOrga.getValue().id, permId, this.options));
  }

  public getPermission(permId: string): Observable<PermissionData> {
    return from(this.arlasIamApi.getPermissionsOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(perms => perms.find(p => p.id === permId))
    );
  }

  public addPermissionToRole(roleId: string, permId: string): Observable<RoleData> {
    return from(this.arlasIamApi.addPermissionToRole(this.currentOrga.getValue().id, roleId, permId, this.options));
  }

  public removePermissionFromRole(roleId: string, permId: string): Observable<RoleData> {
    return from(this.arlasIamApi.removePermissionFromRole(this.currentOrga.getValue().id, roleId, permId, this.options));
  }

  /** PERMISSION COLUMN FILTER **/
  public createColumnFilterPermission(collections: string[]): Observable<PermissionData> {
    return from(this.arlasIamApi.addColumnFilterPermission(collections, this.currentOrga.getValue().id, this.options));
  }

  public updateColumnFilterPermission(permId: string, collections: string[]): Observable<PermissionData> {
    return from(this.arlasIamApi.updateColumnFilterPermission(collections, this.currentOrga.getValue().id, permId, this.options));
  }

  public getColumnFilterPermision(permId: string) {
    return from(this.arlasIamApi.getCollectionsOfColumnFiltersInOrganisation(this.currentOrga.getValue().id, permId, this.options));
  }

  public getCollections(): Observable<string[]> {
    return from(this.arlasIamApi.getOrganisationCollections(this.currentOrga.getValue().id, this.options));
  }
}
