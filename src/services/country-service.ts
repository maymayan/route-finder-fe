import baseApi from "./base-api.ts";

const API = '/country';

export const getCountries = () => baseApi.get(API + '/list');
export const createCountry = (data: any) => baseApi.post(API, data);
export const updateCountry = (data: any) => baseApi.put(API, data);
export const deleteCountry = (id: number) => baseApi.delete(`${API}/${id}`);
