import BaseApiResponseModel from "api/base/BaseApiResponseModel";
import axios from "axios";
import ModelConverter from "utils/model/ModelConverter";
import IAPIClient from "./IApiClient";

const LOCAL_ACCESS_TOKEN = "LA";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL!,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    //Get Tokens
    const token = localStorage.getItem(LOCAL_ACCESS_TOKEN);
    //If there is a token ?
    if (token) {
      //Request headers
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Response interceptors
api.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    console.log(error);
    if (error?.response?.status === 403) {
      if (!!localStorage.getItem(LOCAL_ACCESS_TOKEN)) {
        localStorage.removeItem(LOCAL_ACCESS_TOKEN);
        window.location.href = "/sign-in"; //relative to domain
      }
    }
    return Promise.resolve(error?.response?.data);
  }
);

class AxiosClient implements IAPIClient {
  async post<T extends Object>(
    path: string,
    data: Map<string, any> | any = {},
    config?: Map<string, any> | any
  ): Promise<BaseApiResponseModel<T>> {
    let response = await api.post(path, data, config);
    return ModelConverter.decode(response, BaseApiResponseModel<T>);
  }

  async get<T extends Object>(
    path: string,
    data: Map<string, any> | any = {}
  ): Promise<BaseApiResponseModel<T>> {
    let response = await api.get(path, {
      params: data,
    });
    return ModelConverter.decode(response, BaseApiResponseModel<T>);
  }

  async delete<T extends Object>(
    path: string,
    data: Map<string, any> | any = {}
  ): Promise<BaseApiResponseModel<T>> {
    let response = await api.delete(path, {
      params: data,
    });
    return ModelConverter.decode(response, BaseApiResponseModel<T>);
  }

  async put<T extends Object>(
    path: string,
    data: Map<string, any> | any = {}
  ): Promise<BaseApiResponseModel<T>> {
    let response = await api.put(path, data);
    return ModelConverter.decode(response, BaseApiResponseModel<T>);
  }
}

export default new AxiosClient();