import { Observable, of } from 'rxjs';

export class MockManagerService {
  public getOrganisations(): Observable<any> {
    return of([]);
  }
  public getOrgUsers(): Observable<any> {
    return of([]);
  }
  public getOrgRoles(): Observable<any> {
    return of([]);
  }

  public checkOrganisation(): Observable<any> {
    return of({});
  }
}

export class MockToastrService {

}
