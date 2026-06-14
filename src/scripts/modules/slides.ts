import Swiper from "swiper";
import { Autoplay, Pagination } from 'swiper/modules';

const initSlides = ({ sliderSel, carouselSel }: Record<string, string>) => {
  const sliderItems = Array.from(document.querySelectorAll(sliderSel));
  const carouselItems = Array.from(document.querySelectorAll(carouselSel));

  const slider: Swiper[] = sliderItems.map(
    () =>
      new Swiper(sliderSel, {
        modules: [Autoplay],
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        grabCursor: true,
        speed: 1000,
        autoplay: {
          delay: 7000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false
        },
      }),
  );

  const carousel: Swiper[] = carouselItems.map(
    () =>
      new Swiper(carouselSel, {
        modules: [Pagination],
        loop: false,
        slidesPerView: "auto",
        spaceBetween: 0,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          bulletActiveClass: "is-active"
        },
      }),
  );

  return {
    carousel,
    slider
  };
};

export { initSlides };
