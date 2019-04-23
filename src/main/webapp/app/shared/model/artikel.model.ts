import { ILieferant } from 'app/shared/model/lieferant.model';

export interface IArtikel {
    id?: number;
    artikelBezeichnung?: string;
    preis?: number;
    lieferant?: ILieferant;
}

export class Artikel implements IArtikel {
    constructor(public id?: number, public artikelBezeichnung?: string, public preis?: number, public lieferant?: ILieferant) {}
}
