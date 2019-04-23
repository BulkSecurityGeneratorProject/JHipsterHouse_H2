import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IArtikel } from 'app/shared/model/artikel.model';
import { ArtikelService } from './artikel.service';
import { ILieferant } from 'app/shared/model/lieferant.model';
import { LieferantService } from 'app/entities/lieferant';

@Component({
    selector: 'jhi-artikel-update',
    templateUrl: './artikel-update.component.html'
})
export class ArtikelUpdateComponent implements OnInit {
    artikel: IArtikel;
    isSaving: boolean;

    lieferants: ILieferant[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected artikelService: ArtikelService,
        protected lieferantService: LieferantService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ artikel }) => {
            this.artikel = artikel;
        });
        this.lieferantService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ILieferant[]>) => mayBeOk.ok),
                map((response: HttpResponse<ILieferant[]>) => response.body)
            )
            .subscribe((res: ILieferant[]) => (this.lieferants = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.artikel.id !== undefined) {
            this.subscribeToSaveResponse(this.artikelService.update(this.artikel));
        } else {
            this.subscribeToSaveResponse(this.artikelService.create(this.artikel));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IArtikel>>) {
        result.subscribe((res: HttpResponse<IArtikel>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackLieferantById(index: number, item: ILieferant) {
        return item.id;
    }
}
