import Utils, { apiHandler } from '../utils';
import { handleCarousel, slidesConfig } from './slides';
// @ts-ignore
import { Template } from 'twig';

type TPictureItemData = Record<"name" | "url" | "size_formatted" | "updatedAt" | "ext", string> & Record<"size" | "date" | "width" | "height", number> & { pics: Record<"webp" | "thumb", string> };

const renderPicItem = (
  data: TPictureItemData["pics"],
  rowTpl: Template
): HTMLElement => Utils.parseData(
  {
    data,
    tpl: rowTpl,
    rowSel: '.js-gallery-item'
  }) as HTMLElement;

const renderPicsList = (
  arr: TPictureItemData[],
  wrapperTpl?: Template,
  rowTpl?: Template
): HTMLElement | null => {
  if(!wrapperTpl || !rowTpl) {
    return null;
  }

  const section = Utils.parseData({
    data: {},
    tpl: wrapperTpl,
    rowSel: '.js-gallery-section'
  }) as HTMLElement;

  if(!section) return null;

  const carouselWrapper = section?.querySelector('.js-carousel-wrapper');

  arr.forEach((data, index, array) => {
    const row = renderPicItem(data.pics, rowTpl);

    if(!row) return;

    row.addEventListener('mouseenter', () => {
      if(index === array.length - 1) carouselWrapper?.classList.add('is-active');
    });

    row.addEventListener('mouseleave', () => {
      if(index === array.length - 1) carouselWrapper?.classList.remove('is-active');
    });

    carouselWrapper?.append(row);
  });

  return section as HTMLElement;
}

export const initGallery = async () => {
  const galleryWrapper = document.querySelector('.js-gallery-wrapper');

  if(!galleryWrapper) {
    return;
  }

  const [{ data: { data } }, wrapperTpl, rowTpl] = await Promise.all(
    [
      apiHandler.fetch<{ data: TPictureItemData[] }>('/pictures?all=1&thumbs=1&dir=images/gallery&sortby=name&sortdir=ASC'),
      Utils.fetchTemplateData('gallery-carousel-wrapper'),
      Utils.fetchTemplateData('gallery-carousel-item')
    ]
  );

  const gallerySection = renderPicsList(data, wrapperTpl, rowTpl);

  galleryWrapper.append(gallerySection || '');

  const carousel = galleryWrapper.querySelector(slidesConfig.carouselSel);

  if(carousel) handleCarousel(slidesConfig.carouselSel);
};
