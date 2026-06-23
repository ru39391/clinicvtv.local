class Accordion {
  holder: HTMLElement | null | undefined = null;
  wrapperSel: string = '.js-accordion';
  togglerSel: string = '.js-accordion-btn';
  visibleClassMod: string = 'is-active';
  itemsList: HTMLElement[] = [];
  togglersList: HTMLElement[] = [];

  constructor(options: { holder?: Accordion['holder']; } = {}) {
    this.init(options);
  }

  init(options: { holder?: Accordion['holder']; }) {
    this.holder = options.holder;
    this.itemsList = Array.from((this.holder || document).querySelectorAll(this.wrapperSel));

    if (!this.itemsList.length) {
      return;
    }

    this.togglersList = this.itemsList.map(item => item.querySelector(this.togglerSel) as HTMLElement);

    this.bindEvents();
  }

  handlerToggler(event: MouseEvent) {
    event.preventDefault();

    const { target } = { target: event.target as HTMLElement };
    const idx = this.togglersList.indexOf(target);

    this.itemsList[idx].classList.toggle(this.visibleClassMod);
  }

  bindEvents() {
    this.togglersList.forEach(toggler => toggler.addEventListener('click', (this.handlerToggler as EventListener).bind(this)));
  }
}

export default Accordion;
