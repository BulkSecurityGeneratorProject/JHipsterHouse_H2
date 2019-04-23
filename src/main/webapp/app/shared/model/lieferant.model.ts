import { IArtikel } from 'app/shared/model/artikel.model';

export interface ILieferant {
    id?: number;
    lieferantenName?: string;
    lieferantenNames?: IArtikel[];
}

export class Lieferant implements ILieferant {
    constructor(public id?: number, public lieferantenName?: string, public lieferantenNames?: IArtikel[]) {}
}
