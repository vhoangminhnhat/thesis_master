import BaseApiResponseModel from "api/base/BaseApiResponseModel";

export default interface IAPIClient {
  post<T extends Object>(
    path: string,
    data: Map<string, any> | any,
    config?: Map<string, any> | any
  ): Promise<BaseApiResponseModel<T>>;

  get<T extends Object>(
    path: string,
    data: Map<string, any> | any
  ): Promise<BaseApiResponseModel<T>>;

  delete<T extends Object>(
    path: string,
    data: Map<string, any> | any
  ): Promise<BaseApiResponseModel<T>>;

  put<T extends Object>(
    path: string,
    data: Map<string, any> | any
  ): Promise<BaseApiResponseModel<T>>;
}
