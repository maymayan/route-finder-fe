import baseApi from "./base-api.ts";

const API = '/city';

export const getCities = () => baseApi.get(API + '/list');
export const createCity = (data: any) => baseApi.post(API, data);
export const updateCity = (data: any) => baseApi.put(API, data);
export const deleteCity = (id: number) => baseApi.delete(`${API}/${id}`);
