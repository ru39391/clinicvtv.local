import TabsRenderer, { type TExtTabsOptions } from './tabs-renderer';
import Utils, { type TCommonData, type TResponseData } from '../utils';
// @ts-ignore
import { Template } from 'twig';

export type TPriceTabsOptions = Omit<TExtTabsOptions, 'fetchData'> & {
  fetchData?: <T>(data: Record<'action' | 'id', string>) => Promise<TResponseData<{ data: T[] }>>;
};

class PriceTabsRenderer<T extends TCommonData> extends TabsRenderer<T> {
  // @ts-ignore
  constructor(options) {
    super(options);
  }

  renderPriceItem({ name, price, isMinValue }: T): HTMLElement {
    return Utils.parseData({
      data: {
        name,
        price: isMinValue === 1 ? `от ${price?.toString()}` : price?.toString()
       },
      tpl: this.itemRow as Template,
      rowSel: this.itemSel
    }) as HTMLElement;
  }

  renderPane({ arr, pane: paneId }: { arr: T[]; pane: string; }) {
    const pane = Utils.parseData({
      data: { paneId },
      tpl: this.paneRow as Template,
      rowSel: this.tabPaneSel
    }) as HTMLElement;

    if(!pane) return;

    const itemHolder = pane?.querySelector(this.itemHolderSel);

    arr.forEach(data => {
      const row = this.renderPriceItem(data);

      if(!row) return;

      itemHolder?.append(row);
    });

    this.tabsHolder?.append(pane);
    this.setPanesList(pane);

    if(this.handlePane) this.handlePane(pane);
  };
}

export default PriceTabsRenderer;
