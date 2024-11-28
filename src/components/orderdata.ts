import { ICheckResult, TOrderFullInfo } from  "../types/index";
import { IEvents } from './base/events'

//export class OrderData implements IOrder {
export class OrderData {
    protected payment: string;
    protected address: string;
    protected email: string;
    protected phone: string;
    protected fullOrder: TOrderFullInfo;
    protected events: IEvents;
    protected status: boolean;
    protected message: string;

    constructor (events: IEvents) {
        this.events = events;
    }     

    set paymentData(data: string) {
        this.payment = data;
        this.events.emit('payment:saved', {payment: data});
    }    // OK

    set addressData(data: string) {
        this.address = data;
        this.events.emit('address:saved')
    }    // OK

    set emailData(data: string) {
        this.email = data;
        this.events.emit('contacts:saved')
    }    // OK

    set phoneData(data: string) {
        this.phone = data;
        this.events.emit('contacts:saved')
    }    // OK

    checkInput(input: string | null): boolean {
        return (typeof(input) === 'string' && input.length > 0)? true : false;
    }    // OK

    checkOrder(): ICheckResult {
        const paymentCheck: boolean = this.checkInput(this.payment);
        const addressCheck: boolean = this.checkInput(this.address);
        this.message = 'Пожалуйста, ';
        if (!paymentCheck) {
            this.message += 'выберите способ оплаты ';
            if (!addressCheck) {
                this.message += 'и укажите адрес';
            }
        } else {
            if (!addressCheck) {
                this.message += 'укажите адрес';
            }
            else {
                this.message = ''
            }
        }
        this.status = paymentCheck && addressCheck;
        return {
            status: this.status,
            message: this.message
        };
    }    // OK

    checkContacts(): ICheckResult {
        const emailCheck: boolean = this.checkInput(this.email);
        const phoneCheck: boolean = this.checkInput(this.phone);
        this.message = 'Пожалуйста, укажите ';
        if (!emailCheck) {
            this.message += 'email ';
            if (!phoneCheck) {
                this.message += 'и номер телефона';
            }
        } else {
            if (!phoneCheck) {
                this.message += 'номер телефона';
            }
            else {
                this.message = ''
            }
        }
        this.status = emailCheck && phoneCheck;
        return {
            status: this.status,
            message: this.message
        };

//        return this.checkInput(this.email) && this.checkInput(this.phone)
    }    // OK



    get collectedOrder(): TOrderFullInfo {

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
        this.events.emit('orderInfo:reseted')
    }

}
