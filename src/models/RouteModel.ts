import {EnumTransportationType} from "./enum-transportation-type.ts";

export interface RouteModel {
    origin: String;
    transportationType1: EnumTransportationType;
    firstDest: String;
    transportationType2: EnumTransportationType;
    secondDest: String;
    transportationType3: EnumTransportationType;
    lastDest: String;
}