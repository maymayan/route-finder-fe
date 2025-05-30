import baseApi from "./base-api.ts";
import {RouteModel} from "../models/RouteModel.ts";

const API = '/transportation';

export const getTransportations = () => baseApi.get(API + '/list');
export const createTransportation = (data: any) => baseApi.post(API, data);
export const updateTransportation = (data: any) => baseApi.put(API, data);
export const deleteTransportation = (id: number) => baseApi.delete(`${API}/${id}`);

export const getRoutes = (data: any) => baseApi.post<RouteModel[]>(API + '/routes', data);
