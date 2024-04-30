import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Configuration, DefaultApi } from 'arlas-iam-api';
import { ArlasIamService, ArlasSettings, ArlasSettingsService, ArlasStartupService } from 'arlas-wui-toolkit';
import * as YAML from 'js-yaml';
import { Subject } from 'rxjs/internal/Subject';
import { ManagerService } from '../manager/manager.service';

export const SETTINGS_FILE_NAME = 'settings.yaml';

@Injectable()
export class ArlasIamApi extends DefaultApi {
  public constructor(@Inject('CONF') conf: Configuration, @Inject('base_path') basePath: string, @Inject('fetch') fetch: any) {
    super(conf, basePath, fetch);
  }
}

@Injectable({
  providedIn: 'root'
})
export class IamStartupService {

  public shouldRunApp = true;

  public arlasIamIsUp: Subject<boolean> = new Subject();

  public arlasIamApi: ArlasIamApi;

  public constructor(
    private http: HttpClient,
    private settingsService: ArlasSettingsService,
    private arlasIamService: ArlasIamService,
    private managerService: ManagerService,
    private arlasStartupService: ArlasStartupService
  ) { }

  /**
   * - Fetches and parses the `settings.yaml`.
   * - Validates it against the correponding schema
   * @returns ARLAS settings object Promise
   */
  public applyAppSettings(): Promise<ArlasSettings> {
    return this.http.get(SETTINGS_FILE_NAME, { responseType: 'text', headers: { 'X-Skip-Interceptor': '' } }).toPromise()
      .catch((err) => {
        console.error(err);
        // application should not run if the settings.yaml file is absent
        this.shouldRunApp = false;

        const error = {
          origin: SETTINGS_FILE_NAME + ' file',
          message: 'Cannot read "' + SETTINGS_FILE_NAME + '" file',
          reason: 'Please check if "' + SETTINGS_FILE_NAME + '" is in "src" folder'
        };
        console.error(error);
        return {};
      })
      .then(s => {
        const settings: ArlasSettings = YAML.load(s as string);
        return this.arlasStartupService.validateSettings(settings);
      }) // Validates settings against the correponding schema
      .catch((err: any) => {
        // application should not run if the settings.yaml file is not valid
        this.shouldRunApp = false;
        console.error(err);
        const error = {
          origin: 'ARLAS IAM `' + SETTINGS_FILE_NAME + '` file',
          message: err.toString().replace('Error:', ''),
          reason: 'Please check that the `src/' + SETTINGS_FILE_NAME + '` file is valid.'
        };
        return Promise.reject(err);
      })
      .then(s => {
        this.settingsService.setSettings(s);
        this.arlasIamApi = new ArlasIamApi(new Configuration(), s.authentication.url, window.fetch);
        this.arlasIamService.setArlasIamApi(this.arlasIamApi);
        this.managerService.setArlasIamApi(this.arlasIamApi);
        return s;
      });
  }

  public load(): Promise<any> {
    return this.applyAppSettings()
      .then((data) => this.arlasStartupService.authenticate(data))
      .then((data) => this.arlasStartupService.enrichHeaders(data))
      .then((data) => {
        this.arlasIamService.tokenRefreshed$.subscribe({
          next: loginData => {
            if (!!loginData) {
              const storedArlasOrganisation = this.arlasIamService.getOrganisation();
              const iamHeader = {
                Authorization: 'Bearer ' + loginData.access_token,
              };
              if (!!storedArlasOrganisation) {
                const org = storedArlasOrganisation;
                this.arlasIamService.setHeaders(org, loginData.access_token);
                // Set the org filter only if the organisation is defined
                if (!!org) {
                  // @ts-ignore
                  iamHeader[ARLAS_ORG_FILTER] = org;
                }
              }
              this.managerService.setOptions({
                headers: iamHeader
              });
            }
            return Promise.resolve(data);
          }
        });

      })
      .then((data) => this.arlasStartupService.translationLoaded(data))
      .catch((err: any) => {
        this.shouldRunApp = false;
        console.error(err);
        let message = '';
        if (err.url) {
          message = '- A server error occured \n' + '   - url: ' + err.url + '\n' + '   - status : ' + err.status;
        } else {
          message = err.toString();
        }
        const error = {
          origin: 'ARLAS IAM runtime',
          message,
          reason: ''
        };
        return Promise.resolve(null);
      }).then((x) => {
        this.arlasIamIsUp.next(true);
      });
  }
}
