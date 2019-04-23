import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ILieferant } from 'app/shared/model/lieferant.model';
import { AccountService } from 'app/core';
import { LieferantService } from './lieferant.service';

@Component({
    selector: 'jhi-lieferant',
    templateUrl: './lieferant.component.html'
})
export class LieferantComponent implements OnInit, OnDestroy {
    lieferants: ILieferant[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected lieferantService: LieferantService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.lieferantService
            .query()
            .pipe(
                filter((res: HttpResponse<ILieferant[]>) => res.ok),
                map((res: HttpResponse<ILieferant[]>) => res.body)
            )
            .subscribe(
                (res: ILieferant[]) => {
                    this.lieferants = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInLieferants();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ILieferant) {
        return item.id;
    }

    registerChangeInLieferants() {
        this.eventSubscriber = this.eventManager.subscribe('lieferantListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
