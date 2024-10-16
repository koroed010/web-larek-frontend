https://github.com/koroed010/web-larek-frontend.git

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка товара
```
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
    inBasket: boolean;
}
```

Интерфейс для вывода всех карточек
```
interface IProductList {
    items: IProduct[];
    showFullCard: string | null;
}
```

Данные покупателя
```
interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    paymentValid: boolean;
    contactValid: boolean;
}
```

#### Сокращенные данные для карточки товара в списке на главной странице.
```
type TProductInfo = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;
```

#### Полные данные для карточки товара в попапе предпросмотра.
```
type TProductFullInfo = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>;
```

#### Краткие данные для карточки товара в корзине.
```
type TProductBasketInfo = Pick<IProduct, 'title' | 'price'> & {index: number};
```

#### Поля формы для выбора способа оплаты и ввода адреса покупателя.
```
type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;
```

#### Поля формы для ввода адреса эл. почты и номера телефона покупателя.
```
type TOrderContacttInfo = Pick<IOrder, 'email' | 'phone'>;
```

## Архитектура проекта
Приложение построено на базе MVP-архитектуры с использованием слоев данных, представлений и соединяющего их презентера при посредничестве брокера событий.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Классы моделей данных

В приложении два основных раздела, описывамые соответствующими классами: 
- просмотр предлагаемого ассортимента товаров с возможностью детально ознакомиться с каждым по отдельности, добавить в корзину выбранный товар;
- просмотр корзины с возможностью удалить из нее ранее добавленный товар и с переходом к процедуре оформления заказа, предусматривающим получение контактных данных покупателя, с последующей оплатой покупки.

#### Класс ProductData (интерфейс IProduct)
Расширяет объект карточки продукта (Card), получаемый из API.\
Содержит данные об одном товаре и информацию - добавлен он в корзину или нет.\

Действий и отслеживаемых событий для карточки товара не предусмотрено - все методы, слушатели и эмиттеры событий будут реализованы в других классах.

```
extends Card {
    inBasket: boolean; - признак добавления товара в корзину.
}
```

#### Класс ProductsListData (интерфейс IProductList)
Поля класса: массив карточек товаров, id карточки для просмотра,

Действия со списком товаров:
- получить данные с сервера,
- выбрать карточку для детального просмотра,
- добавить товар в корзину,
- удалить товар из корзины,
- подсчитать общую стоимость товаров в корзине,
- подсчитать общее количество товаров в корзине,
- получать и сохранять данные с помощью методов set и get,
- эмитировать событие для рендера списка товаров, вывода попапа с детальной информацией о товаре, .

```
    items: IProduct[]; - массив объектов типа карточка,
    showFullCard: string | null; - id краточки для отображения в попапе, тип - string,
    events: IEvents; - экземпляр брокера событий,

    getProductList(): IProduct[]; - получить данные с сервера,
    selectProduct(productId: string): IProduct; - выбрать карточку для детального просмотра,
    updateBasketCounter(items: IProduct[]): number; - подсчитать общее количество товаров в корзине,
    countBasketTotal(items: IProduct[]): number | null; - подсчитать общую стоимость товаров в корзине,
    addProductToBasket(productId: string): void; - добавить товар в корзину,
    deleteProductFromBasket(productId: string, payload: Function | null): void; - удалить товар из корзины,
```

#### Класс OrderData (интерфейс IOrder)
Содержит данные покпателя.\
Имена свойств и их типы данных соответствуют представлению в API.\

Действия с оформлением заказа:
- получить и сохранить информацию о покупателе,
- валидировать форму с информацией о покупателе,
- передать данные заказа на сервер,
- получить и обработать ответ сервера,
- удалить введенные данные покупателя (для очистки формы),
- получать и сохранять данные с помощью методов set и get,
- эмитировать соответствующее событие.

```
    payment: string; - выбранный способ оплаты (одна из кнопок формы Order), тип - string,
    address: string; - адрес покупателя из инпута формы Order, тип - string,
    email: string; - email покупателя из инпута формы Contacts, тип - string,
    phone: string; - телефон покупателя из инпута формы Contacts, тип - string,
    paymentValid: boolean; - признак валидности заполнения формы Order, тип - булевый, дефолтное значение false,
    contactValid: boolean; - признак валидности заполнения формы Contacts, тип - булевый, дефолтное значение false,
    events: IEvents; - экземпляр брокера событий,

    getOrderPaymentInfo(data: TOrderPaymentInfo): void; - получить и сохранить способ оплаты и адрес,
    getOrderContactInfo(data: TOrderContactInfo): void; - получить и сохранить email и телефон,
    checkOrderPaymentInfo(data: Record<keyof TOrderPaymentInfo, string>): boolean; - валидировать форму с информацией - способ оплаты и адрес,
    checkOrderContactInfo(data: Record<keyof TOrderContactInfo, string>): boolean; - валидировать форму с информацией - email и телефон,
    sendOrder(order: IOrder): void; - передать данные заказа на сервер, получить и обработать ответ сервера,
    resetOrderInfo(order: IOrder): IOrder; - удалить введенные данные покупателя (для очистки формы),
```


### Классы слоя представления
Классы отвечают за отображение получаемых данных в разметке (передачу их в DOM-элементы).

#### Класс Modal
Общий класс для всех попапов, имеющий набор стандартных методов:\
открытие, закрытие, в т.ч. Esc, клик по кнопке закрытия или оверлею. Устанавливает соответствующие слушатели событий.\

Конструктор класса принимает селектор модального окна, селектор темплейта, объект с данными для элементов темплейта и экземпляр класса 'EventEmitter'.\

Содержимое окна и специфический функционал будут определяться внутри модалки:
- при открытии на главной странице - просмотр карточки или корзины,
- из открытой корзины - переход к форме с выбором способа оплаты и ввода адреса,
- далее - переход к форме с вводом email и телефона,
- далее - к сообщению об успешном оформлении заказа.

Поля:
- modal: HTMLElement; - модальное окно по селектору из конструктора,
- events: EventEmitter; - экземпляр класса брокера событий,
- content: HTMLElement; - темплейт по селектору из конструктора,

- submitButton: buttonHTMLElement; - кнопка подтверждения,
- handleSubmit: Function; - обработчик сабмита, индивидуальный для каждого попапа,

Опциональные поля - для конкретных попапов (с помощью префикса, соответствующего разметке, будем получать уникальные имена полей):
- title?: string; - для товара в списке, в корзине и в предпросмотре, подтверждения заказа, в корзине, в первом окне заказа,
- description?: string; - для окна подтверждения заказа,
- category?: string; - для товара в списке и в предпросмотре,
- image?: string; - для товара в списке и в предпросмотре,
- price?: number; - для товара в списке, в корзине и в предпросмотре, в корзине,
- text?: string; - для товара в предпросмотре,
- itemIndex?: number; - для товара в корзине,


- constructor(selector: string, content: string, data: {}, events: IEvents); - конструктор принимает селектор модального окна, селектор, по которому будет находиться темплейт для отображения в модальном окне, объект с данными для элементов темплейта и экземпляр класса брокера событий для генерирования собственных событий и реакции на события извне,

Методы:
- open(modal: string): HTMLElement; - открывает модальное окно,
- close(modal: string): void; - закрывает модальное окно,
- closeByEsc(event: IEvents): void; - вызывает метод close() при нажатии Esc,
- closeByOverlay(event: IEvents): void; - вызывает метод close() при нажатии на крестик или оверлей,

- submit(content: string, data: {}, handleSubmit: Function): void; - назначаемый для каждого темплейта обработчик сабмита и объект с данными для элементов следующего отрисовываемого темплейта,

- openFullCard(content: string, data: {}): HTMLElement; - отрисовывает элемент карточки товара в модальном окне,
- closeFullCard(): void: - удаляет карточку из разметки, 
- openBasket(content: string, data: {}): HTMLElement; - отрисовывает корзину в модальном окне,
- closeBasket(): void: - удаляет корзину из разметки,
- openOrder(content: string, data: {}): HTMLElement; - отрисовывает форму для выбора способа оплаты и ввода адреса в модальном окне,
- closeOrder(): void: - удаляет форму из разметки,
- openContacts(content: string, data: {}): HTMLElement; - отрисовывает форму для ввода email и телефона в модальном окне,
- closeContacts(): void: - удаляет форму из разметки,
- openSuccess(content: string, data: {}): HTMLElement; - отрисовывает в модальном окне сообщение об удачном оформлени и заказа,
- closeSuccess(): void: - удаляет сообщение из разметки,


#### Класс ProductsList
Выводит массив карточек товаров в контейнер главной страницы.\
Конструктор принимает массив карточек и экземпляр класса 'EventEmitter'.\
Позволяет выбрать карточку для детального просмотра в попапе.

Поля класса:
- items: IProduct[]; - массив объектов типа карточка,
- showFullCard: string | null; - id краточки для отображения в попапе, тип - string,
- events: IEvents; - экземпляр брокера событий,

Методы:
- galleryRender(items: IProduct[], container: HTMLElement): void; - выводит карточки в контейнер,

Генерируемые события:
- 'card-preview:chosen' - выбран товара для просмотра,

Отслеживаемые события:
- 'gallery:loaded' - получение массива карточек товаров с сервера,


#### Класс Basket
Отвечает за отображение на главной странице количества товаров в корзине и за открытие корзины.\
Поля класса:
- basketCounter: number - получаем из модели данные о количестве товаров в корзине,
- events: IEvents; - экземпляр брокера событий,

Метод:
- updateCounter(basketCounter: number): viod  - по событию "корзина изменилась" обновляет span.

Генерируемые события:
- 'basket:open' - переход в корзину,

Отслеживаемые события:
- 'basket:canged' - изменение в корзине,


### Слой коммуникации

#### Класс AppAPI
Класс через конструктор создает экземпляр API с методами для взаимодействия с сервером.\


## Взаимодействие компонентов

Роль презентера будет выполнять блок кода в файле index.ts, отвечающий за взаимодействие данных из модели и представления.\
С помощью брокера событий в данных и в представлении генерируются события, которые обрабатываются в index.ts.\
В index.ts сначала создаются экземпляры всех необходимых классов, затем описываются методы обработки событий.\

Список всех событий, которые могут генерироваться в приложении.\

Список изменений данных, которые необходимо отражать в представлении (генерируются классами модели данных):
- 'gallery:loaded' - получение массива карточек товаров с сервера,
- 'basket:canged' - изменение состава корзины (в т.ч. общей стоимости товаров в корзине и количества товаров в корзине),
- 'order:save' - сохранение данных о покупателе (1 этап - способ оплаты и адрес),
- 'contacts:save' - сохранение данных о покупателе (2 этап - email и номер телефона),
- 'success' - подтверждение оформления заказа,
- 'card-preview:clear' - очистить данные превью товара при закрытии попапа,
- 'order:clear' - очистка формы первого этапа оформления заказа,
- 'contacts:clear' - очистка формы второго этапа оформления заказа,
- 'basket:clear' - очистка корзины после оформления заказа.

Список событий, возникающих при взаимодействии пользователя с интерфейсом (генерируются классами представления):
- 'card-preview:chosen' - выбор товара для просмотра,
- 'card-basket:add' - добавление товара в корзину,
- 'basket:open' - переход в корзину,
- 'card-basket:delete' - удаление товара из корзины,
- 'order:start' - переход из корзины к оформлению заказа (1 этап - способ оплаты и адрес),
- 'order:input' - ввод способа оплаты и адреса,
- 'order:continue' - переход ко 2-му этапу оформления заказа (email и номер телефона),
- 'contacts:input' - ввод email и номер телефона,
- 'order:fullfiled' - завершение оформления заказа (кнопка "Оплатить"),
- 'order:finished' - завершение работы с заказом (кнопка "За новыми покупками"),
- 'order:validate' - валидация заполнения формы первого этапа оформления заказа,
- 'contacts:validate' - валидация заполнения формы второго этапа оформления заказа.


