/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { JHipsterHouseH2TestModule } from '../../../test.module';
import { LieferantDeleteDialogComponent } from 'app/entities/lieferant/lieferant-delete-dialog.component';
import { LieferantService } from 'app/entities/lieferant/lieferant.service';

describe('Component Tests', () => {
    describe('Lieferant Management Delete Component', () => {
        let comp: LieferantDeleteDialogComponent;
        let fixture: ComponentFixture<LieferantDeleteDialogComponent>;
        let service: LieferantService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [JHipsterHouseH2TestModule],
                declarations: [LieferantDeleteDialogComponent]
            })
                .overrideTemplate(LieferantDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(LieferantDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LieferantService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
