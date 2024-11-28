import { TOrderSuccessInfo } from '../types';
import { Component } from './base/component';
import { IEvents } from './base/events'

export class OrderSuccessView extends Component <TOrderSuccessInfo>  {
    protected events: IEvents;
    protected successButton: HTMLButtonElement;
    protected basketTotal: HTMLElement;

    constructor(events: IEvents, protected container: HTMLFormElement) {
        super(container);
        this.events = events;

        this.container.querySelector('.order-success__title').setAttribute('style', 'color: #FFFFFF');
        this.container.querySelector('.order-success__description').setAttribute('style', 'color: #FFFFFF');

        this.successButton = this.container.querySelector('.order-success__close');
        this.basketTotal = this.container.querySelector('.order-success__description');

        this.successButton.addEventListener('click', () => 
            this.events.emit('order:finished')
        )
    }

    set totalData(total: number) {
        this.basketTotal.textContent = `Списано ${total} синапсов`;
    }
}



