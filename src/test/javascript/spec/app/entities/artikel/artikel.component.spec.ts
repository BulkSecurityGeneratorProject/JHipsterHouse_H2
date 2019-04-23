/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JHipsterHouseH2TestModule } from '../../../test.module';
import { ArtikelComponent } from 'app/entities/artikel/artikel.component';
import { ArtikelService } from 'app/entities/artikel/artikel.service';
import { Artikel } from 'app/shared/model/artikel.model';

describe('Component Tests', () => {
    describe('Artikel Management Component', () => {
        let comp: ArtikelComponent;
        let fixture: ComponentFixture<ArtikelComponent>;
        let service: ArtikelService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [JHipsterHouseH2TestModule],
                declarations: [ArtikelComponent],
                providers: []
            })
                .overrideTemplate(ArtikelComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ArtikelComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ArtikelService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Artikel(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.artikels[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
