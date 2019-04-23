import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { JHipsterHouseH2SharedModule } from 'app/shared';
import {
    LieferantComponent,
    LieferantDetailComponent,
    LieferantUpdateComponent,
    LieferantDeletePopupComponent,
    LieferantDeleteDialogComponent,
    lieferantRoute,
    lieferantPopupRoute
} from './';

const ENTITY_STATES = [...lieferantRoute, ...lieferantPopupRoute];

@NgModule({
    imports: [JHipsterHouseH2SharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        LieferantComponent,
        LieferantDetailComponent,
        LieferantUpdateComponent,
        LieferantDeleteDialogComponent,
        LieferantDeletePopupComponent
    ],
    entryComponents: [LieferantComponent, LieferantUpdateComponent, LieferantDeleteDialogComponent, LieferantDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterHouseH2LieferantModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
