const modalSelector = '[data-modal="modalReviews"]';
const modalContentSelector = "[data-reviews-modal-content]";
const modalTemplateSelector = "[data-reviews-modal-template]";
const modalOpenSelector = '[data-reviews-modal-open][data-modal-id="modalReviews"]';
const reviewsSliderSelector = "[data-reviews-slider]";

const initializedRoots = new WeakSet();
const reviewsSliders = new Set();
let reviewsSliderModulesPromise;
let closeListenersBound = false;

function getReviewsSliderModules() {
  if (!reviewsSliderModulesPromise) {
    reviewsSliderModulesPromise = Promise.all([
      import("swiper"),
      import("swiper/modules"),
    ]).then(([swiperModule, modules]) => ({
      Swiper: swiperModule.default,
      Navigation: modules.Navigation,
      FreeMode: modules.FreeMode,
    }));
  }

  return reviewsSliderModulesPromise;
}

function getScopedReviewsModal(trigger) {
  const demoRoot = trigger.closest("[data-registry-demo]");
  return demoRoot?.querySelector(modalSelector) ?? document.querySelector(modalSelector);
}

function clearReviewsModal(modal) {
  const content = modal?.querySelector(modalContentSelector);
  if (!content) return;

  content.replaceChildren();
}

function fillReviewsModal(trigger) {
  const card = trigger.closest("[data-reviews-card]");
  const modal = getScopedReviewsModal(trigger);
  const template = card?.querySelector(modalTemplateSelector);
  const content = modal?.querySelector(modalContentSelector);

  if (
    !(modal instanceof HTMLElement) ||
    !(template instanceof HTMLTemplateElement) ||
    !content
  ) {
    return;
  }

  clearReviewsModal(modal);
  content.append(template.content.cloneNode(true));
  content.scrollTo({ top: 0 });
  modal.querySelector(".modal-window")?.scrollTo({ top: 0 });
}

function bindReviewsCloseListeners() {
  if (closeListenersBound || typeof document === "undefined") return;

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const closeTrigger = event.target.closest("[data-modal-close], .modal-close");
    if (closeTrigger) {
      const modal = closeTrigger.closest(modalSelector);
      if (modal instanceof HTMLElement) {
        clearReviewsModal(modal);
      }
      return;
    }

    if (event.target.matches(modalSelector)) {
      clearReviewsModal(event.target);
    }
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") return;

      document.querySelectorAll(`${modalSelector}.opened`).forEach((modal) => {
        clearReviewsModal(modal);
      });
    },
    true,
  );

  closeListenersBound = true;
}

async function initReviewsSliders(root = document) {
  if (typeof window === "undefined") return;

  root.querySelectorAll(reviewsSliderSelector).forEach((sliderElement) => {
    reviewsSliders.add(sliderElement);
  });

  if (!reviewsSliders.size) return;

  const { Swiper, Navigation, FreeMode } = await getReviewsSliderModules();

  reviewsSliders.forEach((sliderElement) => {
    if (!sliderElement.isConnected) {
      sliderElement.swiper?.destroy(true, true);
      reviewsSliders.delete(sliderElement);
      return;
    }

    if (sliderElement.swiper) {
      sliderElement.swiper.update();
      return;
    }

    const section = sliderElement.closest("[data-reviews]");
    const navigation = {
      prevEl: section?.querySelector("[data-reviews-prev]") ?? null,
      nextEl: section?.querySelector("[data-reviews-next]") ?? null,
    };

    const commonConfig = {
      slidesPerView: "auto",
      grabCursor: true,
      navigation,
      watchSlidesProgress: true,
    };

    const defaultConfig = {
      ...commonConfig,
      modules: [Navigation, FreeMode],
      spaceBetween: 12,
      freeMode: {
        enabled: true,
        sticky: false,
      },
      breakpoints: {
        768: {
          spaceBetween: 16,
        },
        1200: {
          spaceBetween: 20,
        },
      },
    };

    new Swiper(sliderElement, defaultConfig);
  });
}

export function initReviews(root = document) {
  const reviewsSections = root.querySelectorAll("[data-reviews]");
  if (!reviewsSections.length) return;

  initReviewsSliders(root);
  bindReviewsCloseListeners();

  if (initializedRoots.has(root)) return;

  root.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;

      const trigger = event.target.closest(modalOpenSelector);
      if (!(trigger instanceof HTMLElement)) return;

      fillReviewsModal(trigger);
    },
    true,
  );

  initializedRoots.add(root);
}
