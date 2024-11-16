import { TOrderFullInfo } from  "../types/index";
import { IEvents } from './base/events'

//export class OrderData implements IOrder {
export class OrderData {
    protected payment: string;
    protected address: string;
    protected email: string;
    protected phone: string;
    protected fullOrder: TOrderFullInfo;
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events
    }     

    set setPaymentData(data: string) {
        this.payment = data;
        this.events.emit('payment:saved', {payment: data});
    }    // OK

    set setAddressData(data: string) {
        this.address = data;
        this.events.emit('address:saved')
    }    // OK

    set setEmailData(data: string) {
        this.email = data;
        this.events.emit('contacts:saved')
    }    // OK

    set setPhoneData(data: string) {
        this.phone = data;
        this.events.emit('contacts:saved')
    }    // OK

    checkInput(input: string | null): boolean {
        return (typeof(input) === 'string' && input.length > 0)? true : false;
    }    // OK

    checkOrder(): boolean {
        return this.checkInput(this.payment) && this.checkInput(this.address)
    }    // OK

    checkContacts(): boolean {
        return this.checkInput(this.email) && this.checkInput(this.phone)
    }    // OK


    get collectOrder(): TOrderFullInfo {

        this.fullOrder = {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
            total: 0,
            items: ['']
        } 
        return this.fullOrder
    }

    resetOrderInfo(): void {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
    }

}
