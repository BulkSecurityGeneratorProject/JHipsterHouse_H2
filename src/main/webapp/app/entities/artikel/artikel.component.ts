import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IArtikel } from 'app/shared/model/artikel.model';
import { AccountService } from 'app/core';
import { ArtikelService } from './artikel.service';

@Component({
    selector: 'jhi-artikel',
    templateUrl: './artikel.component.html'
})
export class ArtikelComponent implements OnInit, OnDestroy {
    artikels: IArtikel[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected artikelService: ArtikelService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.artikelService
            .query()
            .pipe(
                filter((res: HttpResponse<IArtikel[]>) => res.ok),
                map((res: HttpResponse<IArtikel[]>) => res.body)
            )
            .subscribe(
                (res: IArtikel[]) => {
                    this.artikels = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInArtikels();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IArtikel) {
        return item.id;
    }

    registerChangeInArtikels() {
        this.eventSubscriber = this.eventManager.subscribe('artikelListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
