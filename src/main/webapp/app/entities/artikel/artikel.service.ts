import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IArtikel } from 'app/shared/model/artikel.model';

type EntityResponseType = HttpResponse<IArtikel>;
type EntityArrayResponseType = HttpResponse<IArtikel[]>;

@Injectable({ providedIn: 'root' })
export class ArtikelService {
    public resourceUrl = SERVER_API_URL + 'api/artikels';

    constructor(protected http: HttpClient) {}

    create(artikel: IArtikel): Observable<EntityResponseType> {
        return this.http.post<IArtikel>(this.resourceUrl, artikel, { observe: 'response' });
    }

    update(artikel: IArtikel): Observable<EntityResponseType> {
        return this.http.put<IArtikel>(this.resourceUrl, artikel, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IArtikel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IArtikel[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
