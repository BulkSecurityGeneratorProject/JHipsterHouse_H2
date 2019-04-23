/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JHipsterHouseH2TestModule } from '../../../test.module';
import { LieferantDetailComponent } from 'app/entities/lieferant/lieferant-detail.component';
import { Lieferant } from 'app/shared/model/lieferant.model';

describe('Component Tests', () => {
    describe('Lieferant Management Detail Component', () => {
        let comp: LieferantDetailComponent;
        let fixture: ComponentFixture<LieferantDetailComponent>;
        const route = ({ data: of({ lieferant: new Lieferant(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [JHipsterHouseH2TestModule],
                declarations: [LieferantDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(LieferantDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(LieferantDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.lieferant).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
