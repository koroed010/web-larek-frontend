export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
    inBasket: boolean;
//     events: IEvents;

    sendToBasket(productId: string): TProductInBasket;
}

export interface IProductList {
    total: number;
    items: IProduct[];
    showDetails: string | null;
//     events: IEvents;

    getProductList(): IProduct[];
    selectProduct(productId: string): IProduct;


}

export interface IBasket {
    total: number | null;
    basketCounter: number;
    products: TProductInBasket[] | null;
//     events: IEvents;

    updateBasketCounter(products: TProductInBasket[]): number;
    countTotal(products: TProductInBasket[]): number | null;
    addProduct(product: TProductInBasket): void;
    deleteProduct(productId: string, payload: Function | null): void;


}

export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: TProductIdInBasket[];
    paymentValid: boolean;
    contactValid: boolean;
//     events: IEvents;

    getOrderPaymentInfo(data: TOrderPaymentInfo): void;
    getOrderContactInfo(data: TOrderContactInfo): void;
    checkOrderPaymentInfo(data: Record<keyof TOrderPaymentInfo, string>): boolean;
    checkOrderContactInfo(data: Record<keyof TOrderContactInfo, string>): boolean;
    sendOrder(order: IOrder): void;
    resetOrderInfo(order: IOrder): IOrder;

}


export type TProductInfo = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;
export type TProductFullInfo = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>;

export type TProductInBasket = Pick<IProduct, 'id' | 'title' | 'price'>;
export type TProductIdInBasket = Pick<TProductInBasket, 'id'>;

export type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
export type TOrderConfirmInfo = Pick<IBasket, 'total'>;



