import { TOrderContactInfo } from '../types';
import { cloneTemplate } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events'

export class OrderContactsView extends Component <TOrderContactInfo>  {
    protected events: IEvents;
    protected contactsButton: HTMLButtonElement;
    protected orderEmail: HTMLInputElement;
    protected orderPhone: HTMLInputElement;

    constructor(events: IEvents, protected container: HTMLFormElement) {
        super(container); 
        this.events = events;
        this.orderEmail = container.email;
        this.orderPhone = container.phone;

        this.container.querySelectorAll('.modal__title').forEach((title) => title.setAttribute('style', 'color: #FFFFFF'));
        this.orderEmail.setAttribute('required', 'true');
        this.orderPhone.setAttribute('required', 'true');

        this.contactsButton = container.querySelector('.button');

        this.orderEmail.addEventListener('input', () => 
            this.events.emit('email:input', {email: this.orderEmail.value})
        )
        
        this.orderPhone.addEventListener('input', () => 
            this.events.emit('phone:input', {phone: this.orderPhone.value})
        )

        this.contactsButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.events.emit('order:fulfilled', {data: {email: this.orderEmail.value, phone: this.orderPhone.value}});
        })
    }

    setContactsButton(status: boolean): void  {
        status ? this.contactsButton.removeAttribute('disabled') : this.contactsButton.setAttribute('disabled', 'true');
    }

    resetContactsInfo(): void {
        this.orderEmail.value = "";
        this.orderPhone.value = "";
        this.contactsButton.setAttribute('disabled', 'true');
    }    // OK

    render(): HTMLElement {
        return this.container;
    };
}



