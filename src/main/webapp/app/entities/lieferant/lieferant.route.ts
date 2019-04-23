import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Lieferant } from 'app/shared/model/lieferant.model';
import { LieferantService } from './lieferant.service';
import { LieferantComponent } from './lieferant.component';
import { LieferantDetailComponent } from './lieferant-detail.component';
import { LieferantUpdateComponent } from './lieferant-update.component';
import { LieferantDeletePopupComponent } from './lieferant-delete-dialog.component';
import { ILieferant } from 'app/shared/model/lieferant.model';

@Injectable({ providedIn: 'root' })
export class LieferantResolve implements Resolve<ILieferant> {
    constructor(private service: LieferantService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ILieferant> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Lieferant>) => response.ok),
                map((lieferant: HttpResponse<Lieferant>) => lieferant.body)
            );
        }
        return of(new Lieferant());
    }
}

export const lieferantRoute: Routes = [
    {
        path: '',
        component: LieferantComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.lieferant.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: LieferantDetailComponent,
        resolve: {
            lieferant: LieferantResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.lieferant.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: LieferantUpdateComponent,
        resolve: {
            lieferant: LieferantResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.lieferant.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: LieferantUpdateComponent,
        resolve: {
            lieferant: LieferantResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.lieferant.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const lieferantPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: LieferantDeletePopupComponent,
        resolve: {
            lieferant: LieferantResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.lieferant.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
