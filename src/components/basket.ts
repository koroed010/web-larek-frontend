import { createElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component <IBasketView> {
    protected events: IEvents;

    protected basketList: HTMLElement;
    protected basketPrice: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(events: IEvents, protected container: HTMLElement) {
        super(container);
        this.events = events;

        this.basketButton = this.container.querySelector('.basket__button');
        this.basketList = this.container.querySelector('.basket__list');
        this.basketPrice = this.container.querySelector('.basket__price');

        this.container.querySelector('.modal__title').setAttribute('style', 'color: #FFFFFF');
        this.basketPrice.setAttribute('style', 'color: #FFFFFF');

        this.container.setAttribute('style', 'height: 90vh');
        this.basketList.setAttribute('style', 'overflow: auto');

        this.basketButton.addEventListener('click', () => 
            this.events.emit('order:start')
        )
    }

    set basketItems(itemsList: HTMLElement[]) {
        if (itemsList.length) {
            this.basketList.replaceChildren(...itemsList);
        } else {
            this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста',
            }));
            this.basketList.setAttribute('style', 'color: #FFFFFF');
        }
    }

    set basketTotal(total: number) {
        this.basketPrice.textContent = `${total} синапсов`;
        total === 0 ? this.basketButton.setAttribute('disabled', 'true') : this.basketButton.removeAttribute('disabled');
    }
}
