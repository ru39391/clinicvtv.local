import TabsRenderer, { type TExtTabsOptions } from './tabs-renderer';
import Utils, { STATE_MOD, type TCommonData, type TResponseData } from '../utils';
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

  handleRowHoverEvent(event: Event) {
    const { id } = { id: this.tabData?.id };
    const pane = this.panes.find(({ dataset }) => dataset.id === id);

    if(!pane) return;

    const target = event.target as HTMLElement;
    const rows = Array.from(pane.querySelectorAll(this.itemSel)).filter(row => row !== target);

    target.classList.add(STATE_MOD.active);
    rows.forEach(row => row.classList.remove(STATE_MOD.active));
  }

  renderFeatureItem(str: string): HTMLElement {
    const featureRow = document.createElement('p');

    featureRow.textContent = str;
    return featureRow;
  }

  renderExampleItem({ id, name, desc, introtext, img_before, img_after }: T, index: number): HTMLElement {
    const { webp_before, thumb_before } = {
      webp_before: img_before?.webp || '',
      thumb_before: img_before?.thumb || ''
    };
    const { webp_after, thumb_after } = {
      webp_after: img_after?.webp || '',
      thumb_after: img_after?.thumb || ''
    };
    const row = Utils.parseData({
      data: { id, classMod: index === 0 ? " is-active" : "", webp_before, thumb_before, webp_after, thumb_after },
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

    arr.forEach((data, index) => {
      const row = this.renderExampleItem(data, index);

      if(!row) return;

      row.addEventListener('mouseenter', this.handleRowHoverEvent.bind(this));

      itemHolder?.append(row);
    });

    this.tabsHolder?.append(pane);
    this.setPanesList(pane);

    if(this.handlePane) this.handlePane(pane);
  };
}

export default ExampleTabsRenderer;
