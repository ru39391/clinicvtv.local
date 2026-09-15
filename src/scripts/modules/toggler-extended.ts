import Toggler, { type TTogglerOptions } from './toggler';

class TogglerExtended extends Toggler {
  btnClose: HTMLElement | null = null;

  constructor(options: TTogglerOptions) {
    super(options);

    this.btnClose = document?.querySelector(`.${String(this.btn?.dataset?.close)}`);
    this.btnClose?.addEventListener('click', (this.removeVisibility as EventListener).bind(this));
  }

  addVisibility(event: MouseEvent) {
    event.preventDefault();

    this.btn?.classList.add(this.btnClassMod);
    this.btnClose?.classList.remove(this.btnClassMod);
    this.section?.classList.remove(this.classMod);
  }

  removeVisibility(event: MouseEvent) {
    event.preventDefault();

    this.btn?.classList.remove(this.btnClassMod);
    this.btnClose?.classList.add(this.btnClassMod);
    this.section?.classList.add(this.classMod);
  }

  bindEvents() {
    this.btn?.addEventListener('click', (this.addVisibility as EventListener).bind(this));
  }
}

export default TogglerExtended;
