const modalSelector = '[data-modal="modalVacancy"]';
const vacanciesSliderSelector = "[data-vacancies-slider]";
const vacanciesMobileQuery = "(max-width: 767px)";

const vacanciesSliders = new Set();
let vacanciesSliderMediaQuery;
let vacanciesSliderModulesPromise;
let vacanciesSliderChangeBound = false;

function getVacanciesSliderModules() {
  if (!vacanciesSliderModulesPromise) {
    vacanciesSliderModulesPromise = Promise.all([
      import("swiper"),
      import("swiper/modules"),
    ]).then(([swiperModule, modules]) => ({
      Swiper: swiperModule.default,
      FreeMode: modules.FreeMode,
    }));
  }

  return vacanciesSliderModulesPromise;
}

function setText(modal, selector, value) {
  const target = modal.querySelector(selector);
  if (!target) return;

  target.textContent = value || "";
}

function setHtml(modal, selector, value) {
  const target = modal.querySelector(selector);
  if (!target) return;

  target.innerHTML = value || "";
}

function getVacancyHtml(card) {
  const template = card.querySelector(".vacancy-card__modal-content");

  if (template instanceof HTMLTemplateElement) {
    return template.innerHTML.trim();
  }

  return "";
}

function fillVacancyModal(card, modal) {
  const title = card.dataset.vacancyTitle || "";

  setText(modal, "[data-vacancy-modal-title]", title);
  setHtml(modal, "[data-vacancy-modal-description]", getVacancyHtml(card));

  const vacancyInput = modal.querySelector("[data-vacancy-modal-input]");
  if (vacancyInput instanceof HTMLInputElement) {
    vacancyInput.value = title;
  }

  modal.querySelector(".vacancy-modal__details")?.scrollTo({ top: 0 });
}

async function initVacanciesSlider(root = document) {
  if (typeof window === "undefined") return;

  root.querySelectorAll(vacanciesSliderSelector).forEach((sliderElement) => {
    vacanciesSliders.add(sliderElement);
  });

  if (!vacanciesSliders.size) return;

  const { Swiper, FreeMode } = await getVacanciesSliderModules();

  if (!vacanciesSliderMediaQuery) {
    vacanciesSliderMediaQuery = window.matchMedia(vacanciesMobileQuery);
  }

  const syncVacanciesSliders = () => {
    vacanciesSliders.forEach((sliderElement) => {
      if (!sliderElement.isConnected) {
        sliderElement.swiper?.destroy(true, true);
        vacanciesSliders.delete(sliderElement);
        return;
      }

      if (vacanciesSliderMediaQuery.matches) {
        if (sliderElement.swiper) {
          sliderElement.swiper.update();
          sliderElement.swiper.updateSlidesClasses();
          return;
        }

        new Swiper(sliderElement, {
          modules: [FreeMode],
          slidesPerView: "auto",
          spaceBetween: 12,
          freeMode: true,
          grabCursor: true,
          watchSlidesProgress: true,
        });

        return;
      }

      if (sliderElement.swiper) {
        sliderElement.swiper.destroy(true, true);
      }
    });
  };

  syncVacanciesSliders();

  if (!vacanciesSliderChangeBound) {
    vacanciesSliderMediaQuery.addEventListener("change", syncVacanciesSliders);
    vacanciesSliderChangeBound = true;
  }
}

export function initVacancies(root = document) {
  const vacanciesSections = root.querySelectorAll("[data-vacancies]");
  if (!vacanciesSections.length) return;

  initVacanciesSlider(root);

  const modal = root.querySelector(modalSelector);
  if (!modal) return;

  root.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;

      const trigger = event.target.closest(
        '.vacancy-card__hitarea[data-modal-id="modalVacancy"]',
      );
      const card = trigger?.closest(".vacancy-card");
      if (!(card instanceof HTMLElement)) return;

      fillVacancyModal(card, modal);
    },
    true,
  );

  const firstCard = vacanciesSections[0].querySelector(".vacancy-card");
  if (firstCard instanceof HTMLElement) {
    fillVacancyModal(firstCard, modal);
  }
}
