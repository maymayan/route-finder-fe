import type {Country} from "./country.ts";

export interface City {
    id: number;
    countryId: number;
    country: Country;
    code: string;
    name: string;
}
