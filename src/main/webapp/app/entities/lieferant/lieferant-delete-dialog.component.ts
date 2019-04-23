import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILieferant } from 'app/shared/model/lieferant.model';
import { LieferantService } from './lieferant.service';

@Component({
    selector: 'jhi-lieferant-delete-dialog',
    templateUrl: './lieferant-delete-dialog.component.html'
})
export class LieferantDeleteDialogComponent {
    lieferant: ILieferant;

    constructor(
        protected lieferantService: LieferantService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.lieferantService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'lieferantListModification',
                content: 'Deleted an lieferant'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-lieferant-delete-popup',
    template: ''
})
export class LieferantDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ lieferant }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(LieferantDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.lieferant = lieferant;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/lieferant', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/lieferant', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
