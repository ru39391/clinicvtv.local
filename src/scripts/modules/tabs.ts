export type TTabsOptions = { isActiveTabUnset?: boolean; tabsWrapper: HTMLElement | null; };

class Tabs {
  activeClass: string = "is-active";
  disabledClass: string = "is-disabled";
  tabsHolderSel: string = '.js-tab-content';
  tabLinkSel: string = '.js-tabs-link';
  tabPaneSel: string = '.js-tabs-pane';
  tabsWrapper: HTMLElement | null = null;
  tabsHolder: HTMLElement | null = null;
  togglers: HTMLElement[] = [];
  panes: HTMLElement[] = [];
  tabData: { tab: HTMLElement; id: string; } | null = null;
  isActiveTabUnset: boolean | undefined = undefined;

  constructor(options: TTabsOptions) {
    this.init(options);
  }

  init(options: TTabsOptions) {
    const { isActiveTabUnset, tabsWrapper } = options;

    this.tabsWrapper = tabsWrapper;

    if (!this.tabsWrapper) {
      return;
    }

    this.isActiveTabUnset = Boolean(isActiveTabUnset);
    this.togglers = Array.from(this.tabsWrapper.querySelectorAll(this.tabLinkSel));
    this.tabsHolder = this.tabsWrapper.querySelector(this.tabsHolderSel);
    this.panes = Array.from((this.tabsWrapper).querySelectorAll(this.tabPaneSel));

    this.bindEvents();
  }

  bindEvents() {
    this.togglers.forEach((item, index) => {
      item.addEventListener("click", this.toggleTab.bind(this));

      if(index === 0 && !this.isActiveTabUnset) item.classList.add(this.activeClass);
    });

    this.panes.forEach((item, index) => {
      if(index === 0 && !this.isActiveTabUnset) item.classList.add(this.activeClass);
    });
  }

  setData(activeTab: HTMLElement) {
    this.tabData = {
      tab: activeTab,
      id: String(activeTab.dataset.pane)
    };
  }

  isDisabledTab() {
    return this.tabData?.tab.classList.contains(this.disabledClass);
  }

  setItemsActive() {
    if (this.isDisabledTab()) {
      return;
    }

    this.togglers.forEach((item) => {
      item.classList.toggle(
        this.activeClass,
        item.dataset.pane === this.tabData?.id
      );
    });

    this.panes.forEach((item) => {
      item.classList.toggle(
        this.activeClass,
        item.dataset.id === this.tabData?.id
      );
    });
  }

  handleTabs(tab: HTMLElement) {
    this.setData(tab);
    this.setItemsActive();
  }

  toggleTab(event: Event) {
    event.preventDefault();

    const tab = event.currentTarget as HTMLElement;

    if (tab.classList.contains(this.disabledClass) || tab.classList.contains(this.activeClass)) {
      return;
    }

    this.handleTabs(tab);
  }
}

export default Tabs;
