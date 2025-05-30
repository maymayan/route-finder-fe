import type {Country} from "./country.ts";
import type {City} from "./city.ts";

export interface Location {
    id: number;
    code: string;
    name: string;
    countryId: number;
    country: Country;
    cityId: number;
    city: City;
    airport: boolean;
}
