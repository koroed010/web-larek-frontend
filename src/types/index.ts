
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

    set ProductList(items: IProduct[]);
    get ProductList(): IProduct[];
    get BasketProductList(): TProductBasketInfo[];
    get BasketIdList(): string[];
    set fullCard(productId: string);
    get selectedProduct(): IProduct;

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

export interface ICheckResult {
    status: boolean;
    message: string;
}

export type TProductInfo = Pick<IProduct, 'id' | 'image' | 'title' | 'category' | 'price'>;

export type TProductBasketInfo = Pick<IProduct, 'id' | 'title' | 'price' >;

export type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
export type TOrderSuccessInfo = {total: number};

export type TOrderFullInfo = IOrder & {total: number} & {items: string[]};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // not used

