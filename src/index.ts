import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/basket';
import { Modal } from './components/common/modal';
import { GalleryView } from './components/gallery';
import { OrderContactsView } from './components/ordercontacts';
import { OrderData } from './components/orderdata';
import { OrderPaymentView } from './components/orderpayment';
import { OrderSuccessView } from './components/ordersuccess';
import { ProductView } from './components/product';
import { ProductsListData } from './components/productslistdata';
import './scss/styles.scss';
import { IApi, IApiProductsList, TOrderFullInfo, TProductBasketInfo } from './types';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';

//const events: IEvents = new EventEmitter; // рабочая версия
//============================
const events = new EventEmitter; //  только для тестирования
events.onAll((event) => {
    console.log(event.eventName, event.data)
});
//===========================

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

export const productsList = new ProductsListData(events);
export const order = new OrderData(events);

export const galleryView = new GalleryView(events, document.querySelector('.gallery'));

export const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
export const basketView = new BasketView(events, cloneTemplate(basketTemplate));
export let basketElement: HTMLElement = document.querySelector('.basket');

//export const modalView = new Modal(events, document.querySelector('#modal-container'));
export const modalView = new Modal(document.querySelector('#modal-container'));

export const productPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
export const showFullProd = new ProductView(events, cloneTemplate(productPreviewTemplate));

export const productGalleryTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
export const productBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');

export const orderPaymentViewTemplate: HTMLTemplateElement = document.querySelector('#order');
export const orderPaymentView = new OrderPaymentView(events, cloneTemplate(orderPaymentViewTemplate));

export const orderContactsViewTemplate: HTMLTemplateElement = document.querySelector('#contacts');
export const orderContactsView = new OrderContactsView(events, cloneTemplate(orderContactsViewTemplate));

export const orderSuccessViewTemplate: HTMLTemplateElement = document.querySelector('#success');
export const orderSuccessView = new OrderSuccessView(events, cloneTemplate(orderSuccessViewTemplate));

let basketProductList: TProductBasketInfo[] = [];
let basketTotal: number = 0;

const promiseGallery = new Promise((resolve) => {
    resolve(api.getGallery())
})

promiseGallery
    .then((resGallery: IApiProductsList) => {
        productsList.productList = resGallery.items;
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
});

events.on('gallery:saved', () => {

    let galleryList: HTMLElement[] = [];
    basketTotal = productsList.countBasketTotal();

    productsList.productList.forEach((product) => {
        const addProd = new ProductView(events, cloneTemplate(productGalleryTemplate));
        galleryList.push(addProd.render(product))
    })

    galleryView.galleryItems = galleryList;
    galleryView.counter = basketTotal;

    galleryView.render({
        items: galleryList,
        total: basketTotal
    });
})

events.on('card-preview:chosen', ({id}: {id: string}) => {
    productsList.fullCard = id;
})

events.on('card-preview-id:saved', () => {
    modalView.element = showFullProd.render(productsList.selectedProduct);
    modalView.openModal();
})

events.on('card-basket:change', ({id: productId}: {id: string}) => {
    productsList.changeProductInBasket(productId);
})

events.on('card-basket:changed', () => {
    basketTotal = productsList.countBasketTotal();
    basketProductList = productsList.basketProductList;

    let basketList: HTMLElement[] = [];
    let addBasketItemElement: HTMLElement;
    let basketItemIndex: number = 0;
    let basketItemIndexElement: HTMLElement;

    basketProductList.forEach((product) => {
        let addProd = new ProductView(events, cloneTemplate(productBasketTemplate));

        basketItemIndex += 1;
        addBasketItemElement = addProd.render(product);
        basketItemIndexElement = addBasketItemElement.querySelector('.basket__item-index');
        basketItemIndexElement.textContent = `${basketItemIndex}`;

        basketList.push(addBasketItemElement);
    })

    basketView.basketItems = basketList;
    basketView.basketTotal = basketTotal;

    basketElement = basketView.render({
        items: basketList,
        total: basketTotal
    });

    showFullProd.render(productsList.selectedProduct);    
    galleryView.counter = productsList.updateBasketCounter();
})

events.on('basket:open', () => {
        modalView.element = basketView.render();
        modalView.openModal();
})

events.on('order:start', () => {
    modalView.closeModal();
    modalView.element = orderPaymentView.render();
    orderPaymentView.setOrderButton(order.checkOrder());
    modalView.openModal();
})

events.on('payment:input', ({payment: data}: {payment: string}) => {
    order.paymentData = data;
})

events.on('payment:saved', ({payment}: {payment: string}) => {
    orderPaymentView.setPaymentButton(payment);
    orderPaymentView.setOrderButton(order.checkOrder());
//    modalView.setElement = orderPaymentView.render();
})

events.on('address:input', ({address: data}: {address: string}) => {
    order.addressData = data;
})

events.on('address:saved', () => {
    orderPaymentView.setOrderButton(order.checkOrder());
})

events.on('order:continue', () => {
    modalView.closeModal();
    modalView.element = orderContactsView.render();
    orderContactsView.setContactsButton(order.checkContacts());    
    modalView.openModal();
})

events.on('email:input', ({email: data}: {email: string}) => {
    order.emailData = data;
})

events.on('phone:input', ({phone: data}: {phone: string}) => {
    order.phoneData = data;
})

events.on('contacts:saved', () => {
    orderContactsView.setContactsButton(order.checkContacts());
})

events.on('order:fulfilled', () => {

    let fullOrder: TOrderFullInfo = order.collectedOrder;
    fullOrder.total = productsList.countBasketTotal();
    fullOrder.items = productsList.basketIdList;
    
    const promiseOrder = new Promise((resolve) => {
        resolve(api.sendOrder(fullOrder))
    })
    
    promiseOrder
        .then((resOrder: {id: string, total: number}) => {

            modalView.closeModal();
            productsList.basketIdList.forEach((item) => productsList.changeProductInBasket(item));
            order.resetOrderInfo();

            orderSuccessView.totalData = resOrder.total;
            modalView.element = orderSuccessView.render();
            modalView.openModal();
        })
        .catch((err) => {
            console.log(err);
    });
})


events.on('orderInfo:reseted', () => {
    orderPaymentView.resetPaymentInfo();
    orderContactsView.resetContactsInfo();
})


events.on('order:finished', () => {
    modalView.closeModal();
})
