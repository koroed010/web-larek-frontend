import { IEvents } from './base/events'
import { Component } from './base/component';

interface IGalleryView {
    items: HTMLElement[];
    total: number;
}

export class GalleryView extends Component<IGalleryView> {
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

        this.headerBasketButton.addEventListener('click', () => 
            this.events.emit('basket:open')
        )
    }

    set counter(data: number) {
        this.basketCounter.textContent = `${data}`;
        data === 0 ? this.headerBasketButton.setAttribute('disabled', 'true') : this.headerBasketButton.removeAttribute('disabled');
    }

    set galleryItems(galleryList: HTMLElement[]) {
        this.container.replaceChildren(...galleryList);
    }
}