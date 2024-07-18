import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ArlasIamService } from 'arlas-wui-toolkit';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { catchError, mergeMap } from 'rxjs/operators';
import { UserData } from 'arlas-iam-api';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardOwnerService {

  public constructor(
    private router: Router,
    private arlasIamService: ArlasIamService,
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.isOwnerOfOneOrg(this.arlasIamService.user)) {
      // If arlasIamService has a user no need to try to refresh
      // Usefull to not call refresh too many times in app navigation
      return of(true);
    } else {
      return this.arlasIamService.refresh().pipe(map(loginData => {
        if (this.isOwnerOfOneOrg(loginData.user)) {
          this.arlasIamService.setHeadersFromAccesstoken(loginData.access_token);
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError(() => this.arlasIamService.logoutWithoutRedirection$().pipe(mergeMap(() => {
        this.router.navigate(['/login']);
        return of(false);
      }))));
    }
  }

  private isOwnerOfOneOrg(user: UserData) {
    return !!user && !!user.organisations && user.organisations.filter(o => o.isOwner).length > 0;
  }
}
