import Tabs, { type TTabsOptions } from './tabs';
import Utils, { apiHandler } from '../utils';
import { Template } from 'twig';

type TExtTabsOptions = Record<'itemHolderSel' | 'itemSel' | 'itemContentSel' | 'featureSel' | 'itemFeatureTpl' | 'itemTpl' | 'paneTpl', string>;

class TabsRenderer extends Tabs {
  loadingClass: string = "is-loading";
  itemHolderSel: string = '';
  itemSel: string = '';
  itemContentSel: string = '';
  featureSel: string = '';
  paneRow: Template | null = null;
  itemRow: Template | null = null;
  featureRow: Template | null = null;

  constructor(options: TTabsOptions & TExtTabsOptions) {
    super(options);

    const {
      itemHolderSel,
      itemSel,
      itemContentSel,
      featureSel,
      paneTpl,
      itemTpl,
      itemFeatureTpl
    } = options;

    this.itemHolderSel = itemHolderSel;
    this.itemSel = itemSel;
    this.itemContentSel = itemContentSel;
    this.featureSel = featureSel;
    this.setTemplates([paneTpl, itemTpl, itemFeatureTpl]);
  }

  async setTemplates(arr: string[]) {
    const [
      paneRow,
      itemRow,
      featureRow
    ] = await Promise.all(arr.map(tpl => Utils.fetchTemplateData(tpl)));

    this.paneRow = paneRow as Template;
    this.itemRow = itemRow as Template;
    this.featureRow = featureRow as Template;
  }

  isPaneExist(id: string) {
    return this.panes.find(item => item.dataset.id === id);
  }

  setPanesList(pane: HTMLElement) {
    const { id } = pane.dataset;

    if(!this.isPaneExist(String(id))) {
      this.panes = [...this.panes, pane];
    }
  }

  renderFeatureItem(item: string): HTMLElement {
    return Utils.parseData({
      data: { item },
      tpl: this.featureRow as Template,
      rowSel: this.featureSel
    }) as HTMLElement;
  }

  renderItem({ pics, depts, pagetitle: title, introtext, url }): HTMLElement {
    const { thumb, webp } = pics;
    const row = Utils.parseData({
      data: { webp, thumb, title, url },
      tpl: this.itemRow as Template,
      rowSel: this.itemSel
    });
    const rowContent = row?.querySelector(this.itemContentSel) as HTMLElement;
    const { start, end } = rowContent.dataset;
    const about = Boolean(introtext) ? [depts, `${start} ${introtext} ${end}`] : [depts];

    about.forEach(str => {
      const feature = this.renderFeatureItem(str);

      if(!feature) return;

      rowContent.append(feature as HTMLElement);
    });

    return row as HTMLElement;
  }

  renderPane({ arr, pane: paneId }) {
    const pane = Utils.parseData({
      data: {
        paneId,
        readmoreUrl: '/'
      },
      tpl: this.paneRow as Template,
      rowSel: this.tabPaneSel
    }) as HTMLElement;

    if(!pane) return;

    const itemHolder = pane?.querySelector(this.itemHolderSel);

    arr.forEach(data => {
      const row = this.renderItem(data);

      if(!row) return;

      itemHolder?.append(row);
    });

    this.tabsHolder?.append(pane);
    this.setPanesList(pane);
  }

  async handleTabs(tab: HTMLElement) {
    const { action, id, pane } = tab.dataset;

    this.setData(tab);

    if(!action || this.isPaneExist(String(pane))) {
      this.setItemsActive();
      return;
    }

    this.tabsWrapper?.classList.add(this.loadingClass);

    try {
      const { data } = await apiHandler.fetch<null>(`/${action}/${id}`);

      this.renderPane({ arr: data, pane });
      this.setItemsActive();
    } finally {
      this.tabsWrapper?.classList.remove(this.loadingClass);
    }
  }
}

export default TabsRenderer;
