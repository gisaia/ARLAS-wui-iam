import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import * as draftSchema from 'ajv/lib/refs/json-schema-draft-06.json';
import { Configuration, DefaultApi } from 'arlas-iam-api';
import { ArlasIamService, ArlasSettings, ArlasSettingsService } from 'arlas-wui-toolkit';
import * as YAML from 'js-yaml';
import { Subject } from 'rxjs/internal/Subject';
import { ManagerService } from '../manager/manager.service';
import * as arlasSettingsSchema from './settings.schema.json';

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
    private injector: Injector,
    private translateService: TranslateService,
    private managerService: ManagerService
  ) { }

  public validateSettings(settings: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const ajvObj = new Ajv();
      ajvKeywords(ajvObj, 'uniqueItemProperties');
      const validateConfig = ajvObj
        .addMetaSchema(draftSchema.default)
        .compile((arlasSettingsSchema as any).default);
      if (settings && validateConfig(settings) === false) {
        const errorMessagesList = new Array<string>();
        errorMessagesList.push(
          validateConfig.errors[0].data + ' ' +
          validateConfig.errors[0].message
        );
        console.error(validateConfig.errors);
        reject(new Error(errorMessagesList.join(' ')));
      } else {
        resolve(settings);
      }
    });
  }

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
        return this.validateSettings(settings);
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
        // this.errorService.errorsQueue.push(error);
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

  public translationLoaded(data: any) {
    return new Promise<any>((resolve: any) => {
      const url = window.location.href;
      const paramLangage = 'lg';
      // Set default language to current browser language
      let langToSet = navigator.language.slice(0, 2);
      const regex = new RegExp('[?&]' + paramLangage + '(=([^&#]*)|&|#|$)');
      const results = regex.exec(url);
      if (results && results[2]) {
        langToSet = decodeURIComponent(results[2].replace(/\+/g, ' '));
      }
      const locationInitialized = this.injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
      locationInitialized.then(() => {
        this.translateService.setDefaultLang('en');
        this.translateService.use(langToSet).subscribe(() => {
          console.log(`Successfully initialized '${langToSet}' language.`);
        }, err => {
          console.error(`Problem with '${langToSet}' language initialization.'`);
        }, () => {
          resolve([data, langToSet]);
        });
      });
    });
  }

  public enrichHeaders(settings: ArlasSettings): Promise<ArlasSettings> {
    return new Promise<ArlasSettings>((resolve, reject) => {
      const useAuthent = !!settings && !!settings.authentication
        && !!settings.authentication.use_authent && settings.authentication.use_authent !== 'false';
      const useAuthentIam = useAuthent && settings.authentication.use_authent === 'iam';
      if (useAuthentIam) {
        this.arlasIamService.currentUserSubject.subscribe({
          next: response => {
            if (!!response?.accessToken) {
              this.arlasIamService.setOptions({
                headers: {
                  Authorization: 'Bearer ' + response.accessToken
                }
              });
              this.managerService.setOptions({
                headers: {
                  Authorization: 'Bearer ' + response.accessToken
                }
              });
            } else {
              this.managerService.setOptions({});
              this.arlasIamService.setOptions({});
            }
            resolve(settings);
          }
        });
      } else {
        resolve(settings);
      }

    });
  }

  public load(): Promise<any> {
    return this.applyAppSettings()
      .then((data) => this.enrichHeaders(data))
      .then((data) => this.translationLoaded(data))
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
        // this.errorService.errorsQueue.push(error);
        return Promise.resolve(null);
      }).then((x) => {
        this.arlasIamIsUp.next(true);
      });
  }
}
