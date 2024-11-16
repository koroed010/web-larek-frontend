import { productGalleryTemplate, productsList } from '..';
import { IProduct } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events'
import { Component } from './base/component';
import { ProductView } from './product';


export class GalleryView extends Component<IProduct[]> {
    protected element: HTMLElement;
    protected events: IEvents;

    protected headerBasketButton: HTMLButtonElement;
    protected basketCounter: HTMLElement;    
    
    constructor(events: IEvents, protected container: HTMLElement) {
        super(container);
        this.events = events;

        this.element = document.querySelector('.page__wrapper');
        this.headerBasketButton = this.element.querySelector('.header__basket');
        this.basketCounter = this.element.querySelector('.header__basket-counter');

//        this.container = container;

        this.headerBasketButton.addEventListener('click', () => 
            this.events.emit('basket:open')
        )
    }

    set setBasketCounter(data: number) {
        this.basketCounter.textContent = `${data}`;
    }

// перегрузка метода    
    render(data?: Partial<IProduct[]>): HTMLElement;
    render(productsList: Partial<IProduct[]>): HTMLElement;

    render(prodArray: Partial<IProduct[]> | undefined): HTMLElement {

        if(!productsList) return this.container;

        prodArray.forEach((product) => {
           const addProd = new ProductView(this.events, cloneTemplate(productGalleryTemplate));
           this.container.append(addProd.render(product))
        })
        return this.container;
    };
}