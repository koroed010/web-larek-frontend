import { IEvents } from './base/events';

export class BasketView {
    protected events: IEvents;

    protected basketList: HTMLElement;
    protected basketPrice: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(events: IEvents, protected container: HTMLElement) {
        this.events = events;

        this.basketButton = this.container.querySelector('.basket__button');
        this.basketList = this.container.querySelector('.basket__list');
        this.basketPrice = this.container.querySelector('.basket__price');

        this.container.querySelector('.modal__title').setAttribute('style', 'color: #FFFFFF');
        this.basketPrice.setAttribute('style', 'color: #FFFFFF');

        this.basketButton.addEventListener('click', () => 
            this.events.emit('order:start')
        )
    }

    clearBasketList(): void {
        this.basketList.innerHTML = ''
    };

    set setBasketList(basketItemElement: HTMLElement) {
        this.basketList.append(basketItemElement)
    }

    get getBasket(): HTMLElement {
        return this.container
    }
        
    render(total: number): HTMLElement {
        this.basketPrice.textContent = `${total} синапсов`;
        total === 0 ? this.basketButton.setAttribute('disabled', 'true') : this.basketButton.removeAttribute('disabled');
        return this.container;
    }
}
