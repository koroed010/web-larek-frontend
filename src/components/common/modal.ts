import { Component } from '../base/component';

export class Modal <T> extends Component <T>{
    protected modal: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);
        this.modal = document.querySelector('.modal__content');
        this.container.setAttribute('style', 'position: fixed');

// обработка клика по кнопке закрытия
// + обработка клика по оверлею

        this.container.addEventListener('click', (evt) => {
            let clickTargetElement = evt.target as HTMLElement;
            let clickTarget = clickTargetElement.classList.value;
            if (clickTarget.includes('modal_active') || clickTarget === 'modal__close') {
                this.closeModal();
            }
        });

        this.closeByEscape = this.closeByEscape.bind(this);
    };

    set element(element: HTMLElement) {
        this.modal.append(element);
    };

    deleteElement(): void {
        this.modal.innerHTML = '';
//        this.modal.removeChild;
//        console.log(`delete element ${this.elementToShow}`);
//        this.elementToShow.remove();
//        this.elementToShow = null;
    };

// открытие окна
    openModal(): void {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.closeByEscape);
    };

// закрытие окна 
    closeModal(): void {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this.closeByEscape);
        this.deleteElement();
    };

    closeByEscape(event: KeyboardEvent): void {
        if(event.key === 'Escape') {
        this.closeModal();
        }
    }
}