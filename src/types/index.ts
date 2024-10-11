export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
    inBasket: boolean;
//     events: IEvents;

}

export interface IProductList {
    items: IProduct[];
    showFullCard: string | null;
//     events: IEvents;

    getProductList(): IProduct[];
    selectProduct(productId: string): IProduct;
    updateBasketCounter(items: IProduct[]): number;
    countBasketTotal(items: IProduct[]): number | null;
    addProductToBasket(productId: string): void;
    deleteProductFromBasket(productId: string, payload: Function | null): void;
}

//export interface IBasket {
//    total: number | null;
//    basketCounter: number;
//   products: TProductInBasket[] | null;
//     events: IEvents;
//}

export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    paymentValid: boolean;
    contactValid: boolean;
//     events: IEvents;

    getOrderPaymentInfo(data: TOrderPaymentInfo): void;
    getOrderContactInfo(data: TOrderContactInfo): void;
    checkOrderPaymentInfo(data: Record<keyof TOrderPaymentInfo, string>): boolean;
    checkOrderContactInfo(data: Record<keyof TOrderContactInfo, string>): boolean;
    sendOrder(order: IOrder, itemsId: string[], totalSum: number): void;
    resetOrderInfo(order: IOrder): IOrder;

}


export type TProductInfo = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;
export type TProductFullInfo = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>;
export type TProductBasketInfo = Pick<IProduct, 'title' | 'price'> & {index: number};

export type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;




