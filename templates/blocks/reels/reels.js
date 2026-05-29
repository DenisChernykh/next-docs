import 'modules-vg-reels/styles.css';
import { setupReels } from 'modules-vg-reels';

export async function initReels(reelsData) {
  return setupReels(reelsData, {
    previewSwiper: {
      slidesPerView: 3.4,
      spaceBetween: 8,
      watchOverflow: true,
      centerInsufficientSlides: true,
      breakpoints: {
        768: { slidesPerView: 5, centerInsufficientSlides: true },
        1280: { slidesPerView: 8, spaceBetween: 40, centerInsufficientSlides: true },
      },
    },
    modalSwiper: {
      centeredSlides: true,
      slideToClickedSlide: true,
      watchSlidesProgress: true,
      watchOverflow: true,
      spaceBetween: 24,
      breakpoints: {
        768: { slidesPerView: 2.2 },
        1200: { slidesPerView: 4 },
      },
    },
  });
}
