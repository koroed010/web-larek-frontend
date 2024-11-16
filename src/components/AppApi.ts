import { IApi, IApiProductsList, IProduct, TOrderFullInfo } from "../types";


//export class ApiProductsList implements IApiProductsList {
//    items: IProduct[];
//}

export class AppApi {
    protected _baseApi: IApi;
    protected apiProductsList: IApiProductsList;
    protected fullOrder: TOrderFullInfo;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    getGallery(): Promise<IApiProductsList> {
        return this._baseApi.get<IApiProductsList>('/product').then((apiProductsList: IApiProductsList) => apiProductsList)
    }   // OK

    sendOrder(data: TOrderFullInfo): Promise<TOrderFullInfo> {
        return this._baseApi.post<TOrderFullInfo>('/order', data).then((fullOrder: TOrderFullInfo) => fullOrder)
    }   // OK
}

