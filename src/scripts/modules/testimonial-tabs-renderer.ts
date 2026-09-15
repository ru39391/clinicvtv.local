import TabsRenderer, { type TExtTabsOptions } from './tabs-renderer';
import Utils, { type TCommonData, type TResponseData } from '../utils';
// @ts-ignore
import { Template } from 'twig';

export type TExampleTabsOptions = Omit<TExtTabsOptions, 'fetchData'> & {
  fetchData?: <T>(data: Record<'action' | 'id', string>) => Promise<TResponseData<{ data: T[] }>>;
};

class TestimonialTabsRenderer<T extends TCommonData> extends TabsRenderer<T> {
  // @ts-ignore
  constructor(options) {
    super(options);
  }

  renderExampleItem({ name, desc }: T): HTMLElement {
    const isAccordion = Number(desc?.length) < 150;
    const row = Utils.parseData({
      data: {
        name,
        desc,
        introtext: isAccordion ? '' : `${desc?.slice(0,130)}...`
      },
      tpl: this.itemRow as Template,
      rowSel: this.itemSel
    }) as HTMLElement;

    return row as HTMLElement;
  }

  renderPane({ arr, pane: paneId }: { arr: T[]; pane: string; }) {
    const pane = Utils.parseData({
      data: {
        paneId,
        readmoreUrl: this.tabsHolder?.dataset?.href || ''
      },
      tpl: this.paneRow as Template,
      rowSel: this.tabPaneSel
    }) as HTMLElement;

    if(!pane) return;

    const itemHolder = pane?.querySelector(this.itemHolderSel);

    arr.forEach(data => {
      const row = this.renderExampleItem(data);

      if(!row) return;

      itemHolder?.append(row);
    });

    this.tabsHolder?.append(pane);
    this.setPanesList(pane);

    if(this.handlePane) this.handlePane(pane);
  };
}

export default TestimonialTabsRenderer;
