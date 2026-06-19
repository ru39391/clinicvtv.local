import Twig from 'twig';
import { TPL_URL } from './constants';

/**
 * Парсинг twig-шаблонов
 */
class Utils {
  /**
   * Получение разметки шаблона
   * @param {string} tpl - название шаблона
   * @returns {Object} объект, содержащий шаблон
   */
  static async fetchTemplateData(tpl: string) {
    try {
      const res = await fetch(`${TPL_URL}/${tpl}.twig`);
      const data = await res.text();

      return Twig.twig({ data });
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Парсинг шаблона
   * @param {Object} data - данные кнопки для рендеринга шаблона
   * @param {Twig.Template} tpl - шаблон для рендеринга
   * @param {rowSel} string - селектор класса
   * @returns {HTMLElement} разметка группы полей ввода
   */
  static parseData<T>({data, tpl, rowSel}: { data: T; tpl: Twig.Template; rowSel: string; }) {
    const parser = new DOMParser();
    const { body } = parser.parseFromString(tpl.render(data), 'text/html');

    return body.querySelector(rowSel);
  }
}

export * from './api';
export * from './constants';
export * from './types';
export default Utils;
