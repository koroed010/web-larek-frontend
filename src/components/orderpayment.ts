import { TOrderPaymentInfo } from '../types';
import { Component } from './base/component';
import { IEvents } from './base/events'


export class OrderPaymentView extends Component <TOrderPaymentInfo> {
    protected events: IEvents;
    protected orderButton: HTMLButtonElement;
    protected orderCashButton: HTMLButtonElement;
    protected orderCardButton: HTMLButtonElement;
    protected orderAddress: HTMLInputElement;

    constructor(events: IEvents, protected container: HTMLFormElement) {
        super(container);        
        this.events = events;

        this.orderButton = container.querySelector('.order__button');

        this.orderCashButton = container.cash;
        this.orderCardButton = container.card;
        this.orderAddress = container.address;

        this.container.querySelectorAll('.modal__title').forEach((title) => title.setAttribute('style', 'color: #FFFFFF'));
        this.orderAddress.setAttribute('required', 'true');

        this.orderAddress.addEventListener('input', () => 
            this.events.emit('address:input', {address: this.orderAddress.value})
        )

        this.orderCashButton.addEventListener('click', () => 
            this.events.emit('payment:input', {payment: 'cash'})
        )

        this.orderCardButton.addEventListener('click', () => 
            this.events.emit('payment:input', {payment: 'card'})
        )

        this.orderButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.events.emit('order:continue')
        })
    }

    setPaymentButton(payment: string): void {
        if(this.orderCashButton.getAttribute('name') === payment) {
            this.orderCashButton.classList.add('button_alt-active');
            this.orderCardButton.classList.remove('button_alt-active');
        } else {
            this.orderCardButton.classList.add('button_alt-active');
            this.orderCashButton.classList.remove('button_alt-active');            
        }
    }

    setOrderButton(status: boolean): void  {
        status ? this.orderButton.removeAttribute('disabled') : this.orderButton.setAttribute('disabled', 'true');
    }

    resetPaymentInfo(): void {
        this.orderCardButton.classList.remove('button_alt-active');
        this.orderCashButton.classList.remove('button_alt-active');
        this.orderButton.setAttribute('disabled', 'true');
        this.orderAddress.value = "";
    }    // OK

    render(): HTMLElement {
        return this.container;
    };
}



