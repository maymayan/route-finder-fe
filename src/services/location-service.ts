import baseApi from "./base-api.ts";

const API = '/location';

export const getLocations = () => baseApi.get(API + '/list');
export const createLocation = (data: any) => baseApi.post(API, data);
export const updateLocation = (data: any) => baseApi.put(API, data);
export const deleteLocation = (id: number) => baseApi.delete(`${API}/${id}`);
