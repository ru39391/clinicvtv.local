// @ts-ignore
import Twig, { Template } from 'twig';
import { initSlides } from './modules/slides';
import Accordion from './modules/accordion';
import Tabs from './modules/tabs';

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
  new Accordion();

  Array.from(document.querySelectorAll('.js-tabs')).forEach(wrapper => {
    new Tabs({
      tabsWrapper: wrapper as HTMLElement,
      tabsHolderSel: '.js-tab-content',
      tabLinkSel: '.js-tabs-link',
      tabPaneSel: '.js-tabs-pane',
    });
  });

  initSlides({
    sliderSel: '.js-slides',
    carouselSel: '.js-carousel'
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
