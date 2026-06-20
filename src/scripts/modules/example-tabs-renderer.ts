import TabsRenderer, { type TExtTabsOptions } from './tabs-renderer';
import Utils, { type TCommonData, type TResponseData } from '../utils';
// @ts-ignore
import { Template } from 'twig';

export type TExampleTabsOptions = Omit<TExtTabsOptions, 'fetchData'> & {
  fetchData?: <T>(data: Record<'action' | 'id', string>) => Promise<TResponseData<{ data: T[] }>>;
};

class ExampleTabsRenderer<T extends TCommonData> extends TabsRenderer<T> {
  // @ts-ignore
  constructor(options) {
    super(options);
  }

  renderFeatureItem(str: string): HTMLElement {
    const featureRow = document.createElement('p');

    featureRow.textContent = str;
    return featureRow;
  }

  renderExampleItem({ name, desc, introtext, img_before, img_after }: T): HTMLElement {
    const { webp_before, thumb_before } = {
      webp_before: img_before?.webp || '',
      thumb_before: img_before?.thumb || ''
    };
    const { webp_after, thumb_after } = {
      webp_after: img_after?.webp || '',
      thumb_after: img_after?.thumb || ''
    };
    const row = Utils.parseData({
      data: { webp_before, thumb_before, webp_after, thumb_after },
      tpl: this.itemRow as Template,
      rowSel: this.itemSel
    }) as HTMLElement;
    const rowContent = row?.querySelector(this.itemContentSel) as HTMLElement;
    const { start } = rowContent.dataset;

    [name, `${start} ${introtext}`, desc].forEach(str => {
      const feature = this.renderFeatureItem(str || '');

      if(!feature) return;

      rowContent.append(feature as HTMLElement);
    });

    return row as HTMLElement;
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
      const row = this.renderExampleItem(data);

      if(!row) return;

      itemHolder?.append(row);
    });

    this.tabsHolder?.append(pane);
    this.setPanesList(pane);

    if(this.handlePane) this.handlePane(pane);
  };
}

export default ExampleTabsRenderer;
