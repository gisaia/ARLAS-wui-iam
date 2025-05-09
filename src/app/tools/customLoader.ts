/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { ArlasConfigService, ArlasSettingsService, CONFIG_ID_QUERY_PARAM, NOT_CONFIGURED, PersistenceService } from 'arlas-wui-toolkit';
import enToolkit from 'arlas-wui-toolkit/assets/i18n/en.json';
import frToolkit from 'arlas-wui-toolkit/assets/i18n/fr.json';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


export class ArlasTranslateLoader implements TranslateLoader {

  public constructor(
    private http: HttpClient,
    private arlasSettings: ArlasSettingsService,
    private persistenceService: PersistenceService,
    private configService: ArlasConfigService

  ) { }

  public getTranslation(lang: string): Observable<any> {
    const localI18nAdress = 'assets/i18n/' + lang + '.json?' + Date.now();
    const url = new URL(window.location.href);
    const settings = this.arlasSettings.getSettings();
    const usePersistence = (!!settings && !!settings.persistence && !!settings.persistence.url
      && settings.persistence.url !== '' && settings.persistence.url !== NOT_CONFIGURED);
    const configurationId = url.searchParams.get(CONFIG_ID_QUERY_PARAM);
    if (usePersistence && configurationId) {
      const localI18nObs = this.http.get(localI18nAdress);
      const externalI18nObs = this.persistenceService.get(configurationId)
        .pipe(mergeMap(configDoc => this.getI18n(lang, configDoc, of('{}'))));
      return Observable.create((observer: any) => {
        forkJoin([localI18nObs, externalI18nObs]).subscribe(
          results => {
            const localI18n = results[0];
            const externalI18n = JSON.parse(results[1] as string);
            let merged = localI18n;
            // Properties in externalI18n will overwrite those in localI18n and frToolkit and frComponents .
            if (lang === 'fr') {
              merged = { ...frToolkit, ...localI18n, ...externalI18n as Object };
            } else if (lang === 'en') {
              merged = { ...enToolkit, ...localI18n, ...externalI18n as Object };
            }
            observer.next(merged);
            observer.complete();
          },
          error => {
            this.mergeLocalI18n(localI18nAdress, lang, observer);
          }
        );
      });
    } else {
      return Observable.create((observer: any) => {
        this.mergeLocalI18n(localI18nAdress, lang, observer);
      });
    }
  }

  private getI18n(lang: string, config: any, localTour: Observable<any>): Observable<string> {
    const arlasConfig = this.configService.parse(config.doc_value);
    if (this.configService.hasI18n(arlasConfig) && this.configService.getI18n(arlasConfig)[lang]) {
      const i18nId = this.configService.getI18n(arlasConfig)[lang];
      return this.persistenceService.exists(i18nId).pipe(mergeMap((exist) => {
        if (exist.exists) {
          return this.persistenceService.get(i18nId)
            .pipe(map((i18nDoc) => i18nDoc.doc_value))
            .pipe(catchError((err) => localTour));
        }
        return localTour;
      }));
    }
    return localTour;
  }
  private mergeLocalI18n(localI18nAdress: string, lang: string, observer: any) {
    this.http.get(localI18nAdress).subscribe(
      res => {
        let merged = res;
        // Properties in res will overwrite those in frToolkit and frComponents .
        if (lang === 'fr') {
          merged = { ...frToolkit, ...res };
        } else if (lang === 'en') {
          merged = { ...enToolkit, ...res };
        }
        observer.next(merged);
        observer.complete();
      },
      error => {
        // failed to retrieve requested language file, use default
        observer.complete(); // => Default language is already loaded
      }
    );
  }
}
