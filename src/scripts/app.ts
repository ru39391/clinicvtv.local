// @ts-ignore
import Twig, { Template } from 'twig';
import {
  apiHandler,
  FORM_SELECTORS,
  type TTeamItemData,
  type TPriceItemData,
  type TExampleItemData,
  type TTestimonialItemData
} from './utils';
import { handleCarousel, initSlides, slidesConfig } from './modules/slides';
import { initGallery } from './modules/gallery';
import { showFormItems, submitForm } from './modules/forms';
import Accordion from './modules/accordion';
import ExampleTabsRenderer from './modules/example-tabs-renderer';
import Modal from './modules/modal';
import PriceTabsRenderer from './modules/price-tabs-renderer';
import TestimonialTabsRenderer from './modules/testimonial-tabs-renderer';
import Tabs from './modules/tabs';
import TabsRenderer from './modules/tabs-renderer';
import Toggler from './modules/toggler';
import TogglerExtended from './modules/toggler-extended';

const parseData = (tpl: Template): Node[] => {
  const parser = new DOMParser();

  const { body } = parser.parseFromString(
    tpl.render(),
    'text/html'
  );

  return Array.from(body.children);
}

const fetchTemplate = async (): Promise<Template | undefined> => {
  try {
    const res = await fetch('src/assets/templates/tpl.twig');
    const data = await res.text();

    return Twig.twig({ data });
  } catch(err) {
    console.error(err);
  }
}

const initApp = () => {
  const modalsConfig = {
    btnSel: '.js-modal-btn',
    overlayClass: 'popup-overlay',
    titleSel: FORM_SELECTORS.formTitle,
    inputSel: FORM_SELECTORS.inputTitle,
  };
  const { btnSel, ...modalParams } = modalsConfig;
  const modals = new Modal({
    ...modalsConfig,
    handleOpen: (item) => showFormItems(item)
  });
  const tabsRendererConfig = {
    itemHolderSel: '.js-items-wrapper',
    itemSel: '.js-item',
    itemContentSel: '.js-item-content',
    featureSel: '.js-item-feature',
    itemFeatureTpl: 'team-item-feature'
  };
  const tabs = Array.from(document.querySelectorAll('.js-tabs'));

  tabs.forEach(wrapper => {
    new Tabs({
      tabsWrapper: wrapper as HTMLElement,
    });
  });

  initGallery();
  initSlides(slidesConfig);
  submitForm(modals);

  new Accordion();
  new TabsRenderer<TTeamItemData>({
    ...tabsRendererConfig,
    tabsWrapper: document.querySelector('.js-team-tabs'),
    itemTpl: 'team-carousel-item',
    paneTpl: 'team-carousel-wrapper',
    fetchData: async <TTeamItemData>(
      { action, id }: Record<'action' | 'id', string>
    ) => await apiHandler.fetch<TTeamItemData[]>(`/${action}/${id}`),
    handlePane: (pane) => {
      const paneCarousel = pane.querySelector(slidesConfig.carouselSel);
      const modalBtns = Array.from(pane.querySelectorAll(btnSel)) as HTMLElement[];
      const modals = new Modal({
        ...modalParams,
        modalBtns,
        handleOpen: (item) => showFormItems(item)
      });

      submitForm(modals);

      if(paneCarousel) handleCarousel(slidesConfig.carouselSel);
    }
  });
  new TabsRenderer<TTeamItemData>({
    ...tabsRendererConfig,
    tabsWrapper: document.querySelector('.js-team-grid'),
    itemTpl: 'team-grid-item',
    paneTpl: 'team-grid-wrapper',
    isActiveTabUnset: true,
    fetchData: async <TTeamItemData>(
      { action, id }: Record<'action' | 'id', string>
    ) => await apiHandler.fetch<TTeamItemData[]>(`/${action}/${id}`),
    handlePane: (pane) => {
      const modalBtns = Array.from(pane.querySelectorAll(btnSel)) as HTMLElement[];
      const modals = new Modal({
        ...modalParams,
        modalBtns,
        handleOpen: (item) => showFormItems(item)
      });

      submitForm(modals);
    }
  });
  new PriceTabsRenderer<TPriceItemData>({
    ...tabsRendererConfig,
    tabsWrapper: document.querySelector('.js-price-tabs'),
    itemTpl: 'price-list-item',
    paneTpl: 'price-list-wrapper',
    fetchData: async <TPriceItemData>(
      { action, id }: Record<'action' | 'id', string>
    ) => {
      const { data } = await apiHandler.fetch<{ data: TPriceItemData[] }>(`/${action}?all=1&dept_id=${id}&sortby=name&sortdir=ASC`);

      return data;
    }
  });
  new ExampleTabsRenderer<TExampleItemData>({
    ...tabsRendererConfig,
    tabsWrapper: document.querySelector('.js-example-tabs'),
    itemTpl: 'examples-carousel-item',
    paneTpl: 'examples-carousel-wrapper',
    fetchData: async <TExampleItemData>(
      { action, id }: Record<'action' | 'id', string>
    ) => {
      const actionValue = `${action}${action.split('?').length > 1 ? '&' : '?'}`;
      const { data } = await apiHandler.fetch<{ data: TExampleItemData[] }>(`/${actionValue}all=1&dept_id=${id}&sortby=name&sortdir=ASC`);

      return data;
    },
    handlePane: (pane: HTMLElement) => {
      const paneCarousel = pane.querySelector(slidesConfig.carouselSel);
      const togglers = Array.from(pane.querySelectorAll('.js-show-example')) as HTMLElement[];

      togglers.forEach(btn => new TogglerExtended({ btn }));

      if(paneCarousel) handleCarousel(slidesConfig.carouselSel);
    }
  });
  new TestimonialTabsRenderer<TTestimonialItemData>({
    ...tabsRendererConfig,
    tabsWrapper: document.querySelector('.js-testimonials-list'),
    itemTpl: 'testimonial-carousel-item',
    paneTpl: 'testimonial-carousel-wrapper',
    fetchData: async <TTestimonialItemData>(
      { action, id }: Record<'action' | 'id', string>
    ) => {
      // TODO: объединить два запроса в один
      const { data } = await apiHandler.fetch<TTeamItemData[]>(`/team/${id}`);
      const res = await apiHandler.fetch<TTestimonialItemData[]>(
        `/${action}?all=1&spec_ids=${data.reduce((acc, item, idx, arr) => `${acc}${idx === arr.length - 1 ? item.id : `${item.id},`}`, '')}`
      );

      return res.data;
    },
    handlePane: (pane: HTMLElement) => {
      if(!pane) return;

      new Accordion({
        holder: pane
      });
      handleCarousel(slidesConfig.carouselSel);
    }
  });
  new Toggler({
    btnSel: '.js-nav-toggler',
    btn: document.querySelector('.js-nav-toggler') as HTMLElement,
  });
};

const renderData = async () => {
  const wrapper = document.querySelector<HTMLDivElement>('#app');

  try {
    const tpl = await fetchTemplate();
    const arr = parseData(tpl as Template);

    arr.forEach(item => wrapper?.append(item));
    initApp();
  } catch(err) {
    console.error(err);
  }
};

const init = () => {
  import.meta.env.VITE_APP_ENV === 'development' ? renderData() : initApp();
};

export {
  init
};
