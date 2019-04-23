import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILieferant } from 'app/shared/model/lieferant.model';

type EntityResponseType = HttpResponse<ILieferant>;
type EntityArrayResponseType = HttpResponse<ILieferant[]>;

@Injectable({ providedIn: 'root' })
export class LieferantService {
    public resourceUrl = SERVER_API_URL + 'api/lieferants';

    constructor(protected http: HttpClient) {}

    create(lieferant: ILieferant): Observable<EntityResponseType> {
        return this.http.post<ILieferant>(this.resourceUrl, lieferant, { observe: 'response' });
    }

    update(lieferant: ILieferant): Observable<EntityResponseType> {
        return this.http.put<ILieferant>(this.resourceUrl, lieferant, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ILieferant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ILieferant[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
