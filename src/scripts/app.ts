// @ts-ignore
import Twig, { Template } from 'twig';
import { handleCarousel, initSlides } from './modules/slides';
import Accordion from './modules/accordion';
import Tabs from './modules/tabs';
import TabsRenderer from './modules/tabs-renderer';

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
  const slidesConfig = {
    sliderSel: '.js-slides',
    carouselSel: '.js-carousel'
  };
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

  initSlides(slidesConfig);

  new Accordion();
  new TabsRenderer({
    ...tabsRendererConfig,
    tabsWrapper: document.querySelector('.js-team-tabs'),
    itemTpl: 'team-carousel-item',
    paneTpl: 'team-carousel-wrapper',
    handlePane: (pane) => {
      const paneCarousel = pane.querySelector(slidesConfig.carouselSel);

      if(paneCarousel) handleCarousel(slidesConfig.carouselSel);
    }
  });
  new TabsRenderer({
    ...tabsRendererConfig,
    tabsWrapper: document.querySelector('.js-team-grid'),
    itemTpl: 'team-grid-item',
    paneTpl: 'team-grid-wrapper',
    isActiveTabUnset: true
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
