/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { JHipsterHouseH2TestModule } from '../../../test.module';
import { LieferantUpdateComponent } from 'app/entities/lieferant/lieferant-update.component';
import { LieferantService } from 'app/entities/lieferant/lieferant.service';
import { Lieferant } from 'app/shared/model/lieferant.model';

describe('Component Tests', () => {
    describe('Lieferant Management Update Component', () => {
        let comp: LieferantUpdateComponent;
        let fixture: ComponentFixture<LieferantUpdateComponent>;
        let service: LieferantService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [JHipsterHouseH2TestModule],
                declarations: [LieferantUpdateComponent]
            })
                .overrideTemplate(LieferantUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(LieferantUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LieferantService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Lieferant(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.lieferant = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Lieferant();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.lieferant = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
