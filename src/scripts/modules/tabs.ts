type TTabsOptions = Record<'tabsHolderSel' | 'tabLinkSel' | 'tabPaneSel', string> & { tabsWrapper: HTMLElement | null; };

class Tabs {
  activeClass: string = "is-active";
  disabledClass: string = "is-disabled";
  tabsWrapper: HTMLElement | null = null;
  tabsHolder: HTMLElement | null = null;
  togglers: HTMLElement[] = [];
  panes: HTMLElement[] = [];
  tabData: { tab: HTMLElement; id: string; } | null = null;

  constructor(options: TTabsOptions) {
    this.init(options);
  }

  init(options: TTabsOptions) {
    const {
      tabsWrapper,
      tabsHolderSel,
      tabLinkSel,
      tabPaneSel,
    } = options;

    this.tabsWrapper = tabsWrapper;

    if (!this.tabsWrapper) {
      return;
    }

    this.togglers = Array.from(this.tabsWrapper.querySelectorAll(tabLinkSel));
    this.tabsHolder = this.tabsWrapper.querySelector(tabsHolderSel);
    this.panes = Array.from((this.tabsWrapper).querySelectorAll(tabPaneSel));

    this.bindEvents();
  }

  bindEvents() {
    this.togglers.forEach((item, index) => {
      item.addEventListener("click", this.toggleTab.bind(this));

      if(index === 0) item.classList.add(this.activeClass);
    });

    this.panes.forEach((item, index) => {
      if(index === 0) item.classList.add(this.activeClass);
    });
  }

  toggleTab(event: Event) {
    event.preventDefault();

    const tab = event.currentTarget as HTMLElement;

    if (tab.classList.contains(this.disabledClass)) {
      return;
    }

    this.setData(tab);
    this.handleTabs();
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

  handleTabs() {
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
}

export default Tabs;
