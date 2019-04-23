import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ILieferant } from 'app/shared/model/lieferant.model';
import { LieferantService } from './lieferant.service';

@Component({
    selector: 'jhi-lieferant-update',
    templateUrl: './lieferant-update.component.html'
})
export class LieferantUpdateComponent implements OnInit {
    lieferant: ILieferant;
    isSaving: boolean;

    constructor(protected lieferantService: LieferantService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ lieferant }) => {
            this.lieferant = lieferant;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.lieferant.id !== undefined) {
            this.subscribeToSaveResponse(this.lieferantService.update(this.lieferant));
        } else {
            this.subscribeToSaveResponse(this.lieferantService.create(this.lieferant));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ILieferant>>) {
        result.subscribe((res: HttpResponse<ILieferant>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
