import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Artikel } from 'app/shared/model/artikel.model';
import { ArtikelService } from './artikel.service';
import { ArtikelComponent } from './artikel.component';
import { ArtikelDetailComponent } from './artikel-detail.component';
import { ArtikelUpdateComponent } from './artikel-update.component';
import { ArtikelDeletePopupComponent } from './artikel-delete-dialog.component';
import { IArtikel } from 'app/shared/model/artikel.model';

@Injectable({ providedIn: 'root' })
export class ArtikelResolve implements Resolve<IArtikel> {
    constructor(private service: ArtikelService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IArtikel> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Artikel>) => response.ok),
                map((artikel: HttpResponse<Artikel>) => artikel.body)
            );
        }
        return of(new Artikel());
    }
}

export const artikelRoute: Routes = [
    {
        path: '',
        component: ArtikelComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.artikel.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ArtikelDetailComponent,
        resolve: {
            artikel: ArtikelResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.artikel.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ArtikelUpdateComponent,
        resolve: {
            artikel: ArtikelResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.artikel.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ArtikelUpdateComponent,
        resolve: {
            artikel: ArtikelResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.artikel.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const artikelPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ArtikelDeletePopupComponent,
        resolve: {
            artikel: ArtikelResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jHipsterHouseH2App.artikel.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
