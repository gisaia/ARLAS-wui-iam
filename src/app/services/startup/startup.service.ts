import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import * as draftSchema from 'ajv/lib/refs/json-schema-draft-06.json';
import { Configuration, DefaultApi } from 'arlas-iam-api';
import { ArlasIamService, ArlasSettings, ArlasSettingsService, AuthentSetting } from 'arlas-wui-toolkit';
import * as YAML from 'js-yaml';
import { Subject } from 'rxjs/internal/Subject';
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
    private arlasIamService: ArlasIamService
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
        return s;
      });
  }

  public authenticate(settings: ArlasSettings): Promise<ArlasSettings> {

    return (new Promise<ArlasSettings>((resolve, reject) => {
      // if authentication is configured, trigger authentication service that
      // redirects to login page if it's the first time and fetches the appropriate token
      if (settings) {
        const authent: AuthentSetting = settings.authentication;

        if (!this.arlasIamService.areSettingsValid(authent)[0]) {
          const err = 'Authentication is set while ' + this.arlasIamService.areSettingsValid(authent)[1] + ' are not configured';
          reject(err);
        }
        this.arlasIamApi = new ArlasIamApi(new Configuration(), authent.url, window.fetch);
        this.arlasIamService.setArlasIamApi(this.arlasIamApi);
        resolve(settings);
      }
      return resolve(settings);
    })).catch((err: any) => {
      // application should not run if the settings.yaml file is not valid
      this.shouldRunApp = false;
      const error = {
        origin: 'ARLAS-wui `' + SETTINGS_FILE_NAME + '` file',
        message: err.toString().replace('Error:', ''),
        reason: 'Please check if authentication is well configured in `' + SETTINGS_FILE_NAME + '` file .'
      };
      throw new Error(err);
    });
  }

  public load(): Promise<any> {
    return this.applyAppSettings()

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
