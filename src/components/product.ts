import { IProduct } from '../types';
import { CDN_URL } from '../utils/constants';
import { IEvents } from './base/events'
import { Component } from './base/component';

// класс общий для товара в списке, в окне предпросмотра и в корзине
export class ProductView extends Component <IProduct> {
    protected events: IEvents;
    protected cardButton: HTMLButtonElement;

    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardTitle: HTMLElement;
    protected cardDescription: HTMLElement;
    protected cardPrice: HTMLElement;

    protected cardId: string;
    protected cardInBasket: boolean;

    constructor(events: IEvents, protected container: HTMLElement) {
        super(container);
        this.events = events;

        this.cardButton = this.container.querySelector('.card__button');
        this.cardCategory = this.container.querySelector('.card__category');
        this.cardImage = this.container.querySelector('.card__image');
        this.cardTitle = this.container.querySelector('.card__title');
        this.cardDescription = this.container.querySelector('.card__text');
        this.cardPrice = this.container.querySelector('.card__price');

// слушатель на карточку в галлерее
        if(this.container.classList.contains('gallery__item')) {
            this.container.addEventListener('click', () => 
            this.events.emit('card-preview:chosen', {id: this.cardId})
        )};

// при нажатии на кнопку добавления товара в корзину или удаления товара из корзины значение inBasket будет меняться
        if(this.cardButton) 
            this.cardButton.addEventListener('click', () => this.events.emit('card-basket:change', {id: this.cardId}))
    };

    set id (id: string) {
        this.cardId = id;
    };

    set title (title: string) {
        this.cardTitle.textContent = title;
    };

    set price (price: string) {
        this.cardPrice.textContent = price ? `${price} синапсов` : 'Бесценно';
        if(this.container.classList.contains('card_full')) {
            price ? this.cardButton.removeAttribute('disabled') : this.cardButton.setAttribute('disabled', 'true');
        }
    };

    set image (image: string) {
        if(this.cardImage) this.cardImage.src = `${CDN_URL}${image}`;
    };

    set description (description: string) {
        if(this.description) this.cardDescription.textContent = description;
    };

    set category (category: string) {
        if(this.cardCategory) {
            this.cardCategory.textContent = category;
            this.setCategoryBg(this.cardCategory.textContent);
        } 
    };

    set inBasket (inBasket: boolean) {
        this.cardInBasket = inBasket;
        if(this.container.classList.contains('card_full')) {
            this.cardButton.textContent = inBasket ? 'Удалить из корзины' : 'В корзину';
        }
    };

//    get productId() {
//        return this.id;
//    };

    setCategoryBg(category: string): void {

        let categoryBg: string = '';

        switch (category) {
            case 'софт-скил':
                categoryBg = 'soft';
                break
            case 'хард-скил':
                categoryBg = 'hard';
                break
            case 'другое':
                categoryBg = 'other';
                break
            case 'дополнительное':
                categoryBg = 'additional';
                break
            case 'кнопка':
                categoryBg = 'button';
                break
        }
        this.cardCategory.classList.replace(this.cardCategory.classList[1], `card__category_${categoryBg}`);
    }

//    deleteProduct() {
//        this.container.remove();
//        this.container = null;
//    };
}