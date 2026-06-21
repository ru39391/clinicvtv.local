import { STATE_MOD } from '../utils';

export type TTogglerOptions = Record<'btn', HTMLElement> & Partial<Record<'bodyClassMod' | 'btnSel', string>>;;

class Toggler {
  btn: HTMLElement | null = null;
  sectionSel: string = '';
  section: HTMLElement | null = null;
  classMod: string = STATE_MOD.visible;
  btnClassMod: string = STATE_MOD.active;
  btnSel?: string = undefined;
  bodyClassMod?: string = undefined;

  constructor(options: TTogglerOptions) {
    this.init(options);
  }

  init(options: TTogglerOptions) {
    const { bodyClassMod, btn, btnSel } = options;

    this.btn = btn;
    this.btnSel = btnSel;
    this.sectionSel = `.${String(this.btn?.dataset?.target)}`;
    this.section = document.querySelector(this.sectionSel);
    this.bodyClassMod = bodyClassMod;

    if (!this.section) {
      return;
    }

    this.bindEvents();
  }

  addBodyClassMod() {
    if(!this.bodyClassMod) return;

    const { body } = document;

    body.classList.add(this.bodyClassMod);
    body.addEventListener('click', this.hideSection.bind(this));
  }

  removeBodyClassMod() {
    if(!this.bodyClassMod) return;

    const { body } = document;

    body.classList.remove(this.bodyClassMod);
    body.removeEventListener('click', this.hideSection.bind(this));
  }

  toggleBodyClassMod() {
    const isActive = this.section?.classList.contains(this.classMod);

    if(this.section) isActive ? this.addBodyClassMod() : this.removeBodyClassMod();
  }

  hideSection(event: MouseEvent) {
    const item = event.target as HTMLElement;

    if(this.btnSel && item.closest(this.btnSel)) {
      return;
    } else {
      this.btn?.classList.remove(this.btnClassMod);
      this.section?.classList.remove(this.classMod);
    }

    this.toggleBodyClassMod();
  }

  toggleVisibility(event: MouseEvent) {
    event.preventDefault();

    this.btn?.classList.toggle(this.btnClassMod);
    this.section?.classList.toggle(this.classMod);
    this.toggleBodyClassMod();
  }

  bindEvents() {
    this.btn?.addEventListener('click', (this.toggleVisibility as EventListener).bind(this));
  }
}

export default Toggler;
