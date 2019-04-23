import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IArtikel } from 'app/shared/model/artikel.model';
import { ArtikelService } from './artikel.service';

@Component({
    selector: 'jhi-artikel-delete-dialog',
    templateUrl: './artikel-delete-dialog.component.html'
})
export class ArtikelDeleteDialogComponent {
    artikel: IArtikel;

    constructor(protected artikelService: ArtikelService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.artikelService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'artikelListModification',
                content: 'Deleted an artikel'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-artikel-delete-popup',
    template: ''
})
export class ArtikelDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ artikel }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ArtikelDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.artikel = artikel;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/artikel', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/artikel', { outlets: { popup: null } }]);
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
