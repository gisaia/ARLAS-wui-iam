import { Injectable } from '@angular/core';
import {
  MemberData, OrgData,
  OrgExists,
  OrgUserDef,
  PermissionData,
  RoleData,
  UpdateUserDef,
  UserData,
  ArlasMessage
} from 'arlas-iam-api';
import { ArlasIamApi } from 'arlas-wui-toolkit';
import { BehaviorSubject, Observable, finalize, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private options = {};
  private arlasIamApi: ArlasIamApi;

  public currentOrga = new BehaviorSubject<{ id: string; name: string; displayName: string; }>(null);
  public currentUser: UserData = null;
  public managerLoading = false;
  public constructor() { }

  public setOptions(options: any): void {
    this.options = options;
  }

  public setArlasIamApi(api: ArlasIamApi) {
    this.arlasIamApi = api;
  }

  /** ORGA **/
  public getOrganisations(): Observable<OrgData[]> {
    // Use Set Timeout to fix  error ngIf - Expression has changed after it was checked
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getOrganisations(this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public checkOrganisation(): Observable<OrgExists> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.checkOrganisation(this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public createOrganisation(name?: string): Observable<OrgData> {
    setTimeout(() => this.managerLoading = true);
    if (!!name) {
      return from(this.arlasIamApi.createOrganisationWithName(name, this.options))
        .pipe(finalize(() => this.managerLoading = false));
    } else {
      return from(this.arlasIamApi.createOrganisation(this.options))
        .pipe(finalize(() => this.managerLoading = false));
    }
  }

  public getOrgEmails(): Observable<string[]> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getEmails(this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  /** USERS **/
  public getOrgUsers(): Observable<MemberData[]> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getUsers(this.currentOrga.getValue().id, undefined /* rname */, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getOrgUser(orgId: string, userId: string): Observable<MemberData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getUser(orgId, userId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getUser(userId: string): Observable<UserData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.readUser(userId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getUserRoles(userId: string): Observable<RoleData[]> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getRoles(this.currentOrga.getValue().id, userId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getUserGroups(userId: string): Observable<RoleData[]> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getGroups(this.currentOrga.getValue().id, userId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public addRoleToUser(userId: string, roleId: string): Observable<UserData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.addRoleToUserInOrganisation(this.currentOrga.getValue().id, userId, roleId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public removeRoleFromUser(userId: string, roleId: string): Observable<UserData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.removeRoleFromUserInOrganisation(this.currentOrga.getValue().id, userId, roleId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public updateUser(userId: string, userDef: UpdateUserDef): Observable<UserData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.updateUser(userDef, userId, this.options)).pipe(finalize(() => this.managerLoading = false));
  }

  public updateUserRole(userId: string, roleList: string[]) {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.putRoles({ ids: roleList }, this.currentOrga.getValue().id, userId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public addUserToOrg(user: OrgUserDef): Observable<OrgData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.addUserToOrganisation(user, this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public removeUserFromOrg(userId: string): Observable<OrgData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.removeUserFromOrganisation(this.currentOrga.getValue().id, userId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public deleteUser(userId: string): Observable<ArlasMessage> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.deleteUser(userId, this.options)).pipe(finalize(() => this.managerLoading = false));
  }

  public activateUser(userId: string): Observable<ArlasMessage> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.activateUser(userId, this.options)).pipe(finalize(() => this.managerLoading = false));
  }

  public deactivateUser(userId: string): Observable<ArlasMessage> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.deactivateUser(userId, this.options)).pipe(finalize(() => this.managerLoading = false));
  }

  /** ROLES **/
  public getOrgRoles(): Observable<RoleData[]> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getRolesOfOrganisation(this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public addRole(name: string, description: string): Observable<RoleData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.addRoleToOrganisation({ name, description }, this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public updateRole(roleId: string, name: string, description: string): Observable<RoleData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.updateRoleInOrganisation({ name, description }, this.currentOrga.getValue().id, roleId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getRole(roleId: string): Observable<RoleData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getRolesOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(roles => roles.find(r => r.id === roleId))
    ).pipe(finalize(() => this.managerLoading = false));
  }



  /** GROUPS **/
  public getOrgGroups(): Observable<RoleData[]> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getGroupsOfOrganisation(this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public addGroup(name: string, description: string): Observable<RoleData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.addGroupToOrganisation({ name, description }, this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public updateGroup(roleId: string, name: string, description: string): Observable<RoleData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.updateGroupInOrganisation({ name, description }, this.currentOrga.getValue().id, roleId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getGroup(roleId: string): Observable<RoleData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getGroupsOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(roles => roles.find(r => r.id === roleId))
    ).pipe(finalize(() => this.managerLoading = false));
  }

  public deleteGroup(groupId: string): Observable<ArlasMessage> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.deleteGroupInOrganisation(this.currentOrga.getValue().id, groupId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  /** PERMISSIONS **/
  public getOrgPermissions(): Observable<PermissionData[]> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getPermissionsOfOrganisation(this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public addPermission(value: string, description: string): Observable<PermissionData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.addPermission({ value, description }, this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public updatePermission(permId: string, value: string, description: string): Observable<PermissionData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.updatePermission({ value, description }, this.currentOrga.getValue().id, permId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getPermission(permId: string): Observable<PermissionData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getPermissionsOfOrganisation(this.currentOrga.getValue().id, this.options)
      .then(perms => perms.find(p => p.id === permId))
    ).pipe(finalize(() => this.managerLoading = false));
  }

  public addPermissionToRole(roleId: string, permId: string): Observable<RoleData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.addPermissionToRole(this.currentOrga.getValue().id, roleId, permId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public removePermissionFromRole(roleId: string, permId: string): Observable<RoleData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.removePermissionFromRole(this.currentOrga.getValue().id, roleId, permId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public deletePermission(permId: string): Observable<ArlasMessage> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.deletePermission(this.currentOrga.getValue().id, permId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  /** PERMISSION COLUMN FILTER **/
  public createColumnFilterPermission(collections: string[]): Observable<PermissionData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.addColumnFilterPermission(collections, this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public updateColumnFilterPermission(permId: string, collections: string[]): Observable<PermissionData> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.updateColumnFilterPermission(collections, this.currentOrga.getValue().id, permId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getColumnFilterPermision(permId: string) {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getCollectionsOfColumnFiltersInOrganisation(this.currentOrga.getValue().id, permId, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }

  public getCollections(): Observable<string[]> {
    setTimeout(() => this.managerLoading = true);
    return from(this.arlasIamApi.getOrganisationCollections(this.currentOrga.getValue().id, this.options))
      .pipe(finalize(() => this.managerLoading = false));
  }
}
