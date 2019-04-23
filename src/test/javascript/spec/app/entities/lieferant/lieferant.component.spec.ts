/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JHipsterHouseH2TestModule } from '../../../test.module';
import { LieferantComponent } from 'app/entities/lieferant/lieferant.component';
import { LieferantService } from 'app/entities/lieferant/lieferant.service';
import { Lieferant } from 'app/shared/model/lieferant.model';

describe('Component Tests', () => {
    describe('Lieferant Management Component', () => {
        let comp: LieferantComponent;
        let fixture: ComponentFixture<LieferantComponent>;
        let service: LieferantService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [JHipsterHouseH2TestModule],
                declarations: [LieferantComponent],
                providers: []
            })
                .overrideTemplate(LieferantComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(LieferantComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LieferantService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Lieferant(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.lieferants[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
