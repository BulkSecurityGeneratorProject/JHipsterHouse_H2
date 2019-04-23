import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILieferant } from 'app/shared/model/lieferant.model';

@Component({
    selector: 'jhi-lieferant-detail',
    templateUrl: './lieferant-detail.component.html'
})
export class LieferantDetailComponent implements OnInit {
    lieferant: ILieferant;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ lieferant }) => {
            this.lieferant = lieferant;
        });
    }

    previousState() {
        window.history.back();
    }
}
