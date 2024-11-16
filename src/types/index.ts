
export interface IApiProduct {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number;
}

export interface IApiProductsList {
    items: IApiProduct[];
}

export interface IProduct extends IApiProduct {
    inBasket?: boolean;
}

export interface IProductList {
    items: IProduct[];
    showFullCard: string | null;

    set setProductList(items: IProduct[]);
    get getProductList(): IProduct[];
    get getBasketProductList(): TProductBasketInfo[];
    get getBasketIdList(): string[];
    set setShowFullCard(productId: string);
    get selectProduct(): IProduct;

    clearSelectedProduct(): void;
    updateBasketCounter(): number;
    countBasketTotal(): number | null;
    changeProductInBasket(productId: string): void;
}

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>
}

export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export type TProductInfo = Pick<IProduct, 'id' | 'image' | 'title' | 'category' | 'price'>;

export type TProductBasketInfo = Pick<IProduct, 'id' | 'title' | 'price' >;

export type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
export type TOrderSuccessInfo = {total: number};

export type TOrderFullInfo = IOrder & {total: number} & {items: string[]};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // not used

