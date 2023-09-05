import { BehaviorSubject, Observable, of } from 'rxjs';

export class MockManagerService {
  public currentOrga = new BehaviorSubject<{ id: string; name: string; displayName: string; }>(null);

  public getOrganisations(): Observable<any> {
    return of([]);
  }
  public getOrgUsers(): Observable<any> {
    return of([]);
  }

  public getRolesOfOrganisation(): Observable<any> {
    return of([]);
  }

  public getOrgRoles(): Observable<any> {
    return of([]);
  }

  public checkOrganisation(): Observable<any> {
    return of({});
  }

  public getOrgGroups(): Observable<any> {
    return of([]);
  }
}

export class MockToastrService {

}
