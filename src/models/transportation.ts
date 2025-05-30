import type {Location} from "./location.ts";
import type {EnumTransportationType} from "./enum-transportation-type.ts";

export interface Transportation {
    id: number;
    fromLocationId: number;
    fromLocation: Location;
    toLocationId: number;
    toLocation: Location;
    transportationType: EnumTransportationType;
    operatingDays: Array<number>;
}
