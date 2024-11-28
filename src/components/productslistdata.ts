import { IProduct, TProductBasketInfo } from  "../types/index";
import { IEvents } from './base/events'

export class ProductsListData {
    protected _items: IProduct[];
    protected _showFullCard: string | null;
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events
    }

    set productList(items: IProduct[]) {
        items.forEach((item: IProduct) => {
            Object.assign(item, {inBasket: false});
        })
        this._items = items;
        this.events.emit('gallery:saved')
    };

// для вывода карточек на главной странице    
    get productList(): IProduct[] {
        return this._items;
    };

// для формирования корзины - отбираем массив карточек товаров в корзине
    get basketProductList(): TProductBasketInfo[] {
        let basketArray: TProductBasketInfo[] = [];
        this._items.forEach((item: IProduct) => {
            if(item.inBasket) basketArray.push({id: item.id, price: item.price, title: item.title})
        });
        return basketArray;
    };

    // для формирования заказа - отбираем массив id товаров в корзине
    get basketIdList(): string[] {
        let basketArray: string[] = [];
         this._items.forEach((item: IProduct) => {
            if(item.inBasket) basketArray.push(item.id)
        });
        return basketArray;
    };

    set fullCard(productId: string) {
        this._showFullCard = productId;
        this.events.emit('card-preview-id:saved')
    };

    get selectedProduct(): IProduct {
        let selectedProduct: IProduct;
        this._items.forEach((item) => {
            if (item.id === this._showFullCard) selectedProduct = item
        });
        return selectedProduct
    };

    clearSelectedProduct(): void {
        this._showFullCard = "";
        this.events.emit('card-preview:clear')
    };

    updateBasketCounter(): number  {
        let basketCounter: number = 0;
        this._items.forEach((item: IProduct) => {
            if (item.inBasket) basketCounter += 1
        });
        return basketCounter
    };

    countBasketTotal(): number | null {
        let basketTotal: number = 0;
        this._items.forEach((item: IProduct) => {
            if (item.inBasket) basketTotal += item.price
        });
        return basketTotal;
    };

    changeProductInBasket(productId: string): void {
        this._items.forEach((item: IProduct) => {
            if (item.id === productId) item.inBasket = !item.inBasket
        });
        this.events.emit('card-basket:changed')
    };
}

