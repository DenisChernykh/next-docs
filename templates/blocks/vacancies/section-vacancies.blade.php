@php
    $section = get_collections_with_meta('vacancies', 'vacancies', [
        'title',
        'text',
        'pay',
        'exp',
        'work_time',
    ]);

    $sectionActive = $section['active'] ?? true;
    $sectionMeta = $section['meta'] ?? [];
    $vacancies = $section['items'] ?? [];

    $sectionTitle = !empty($sectionMeta['title'])
        ? $sectionMeta['title']
        : 'Станьте частью нашей команды';

    $sectionText = $sectionMeta['description'] ?? '';

    $variantRaw = trim((string) get_variable('vacancies_variant'));
    $allowedVariants = ['split-aside', 'grid-cta'];
    $variant = in_array($variantRaw, $allowedVariants, true) ? $variantRaw : 'split-aside';

    $modalTitle = 'Сделайте шаг к новой работе';
    $modalDescription = 'Заполните обязательные поля и отправьте заявку';
@endphp

@if($sectionActive && count($vacancies))
    <section
        class="section vacancies vacancies--{{ $variant }}"
        id="vacancies"
        aria-labelledby="vacancies-title"
        data-header-surface="light"
        data-vacancies
    >
        <div class="container">
            <div class="vacancies__layout">
                @if($variant === 'split-aside')
                    <div class="vacancies__aside">
                @endif

                <div class="vacancies__header">
                    <div class="section-header {{ $variant === 'split-aside' ? 'section-header--column-start' : '' }}">
                        <h2 class="section-title" id="vacancies-title">
                            {!! $sectionTitle !!}
                        </h2>

                        @if($sectionText)
                            <div class="section-text">
                                {!! $sectionText !!}
                            </div>
                        @endif
                    </div>
                </div>

                @if($variant === 'split-aside')
                    <div class="vacancies__empty">
                        <div class="vacancies__empty-copy">
                            <h3 class="vacancies__empty-title">Не нашли вакансию?</h3>
                            <div class="vacancies__empty-text">Оставьте свой отклик и мы свяжемся с вами</div>
                        </div>

                        @include(get_view('button'), [
                            'text' => 'Откликнуться',
                            'class' => 'vacancies__empty-button',
                            'modifiers' => ['primary'],
                            'modalId' => 'modalContact',
                            'attrs' => [
                                'data-modal-title' => $modalTitle,
                                'data-modal-description' => $modalDescription,
                            ],
                        ])
                    </div>
                    </div>
                @endif

                <div class="vacancies__content">
                    <div class="vacancies__slider swiper" data-vacancies-slider>
                        <div class="vacancies__cards swiper-wrapper" aria-label="Список вакансий">
                            @foreach($vacancies as $vacancyItem)
                                @php
                                    $vacancyTitle = $vacancyItem['title'] ?? '';
                                    $vacancyText = $vacancyItem['text'] ?? '';
                                    $vacancyPay = $vacancyItem['pay'] ?? '';
                                    $vacancyExp = $vacancyItem['exp'] ?? '';
                                    $vacancyWorkTime = $vacancyItem['work_time'] ?? '';
                                @endphp

                                @if($vacancyTitle || $vacancyText || $vacancyPay)
                                    <article
                                        class="vacancy-card swiper-slide"
                                        data-vacancy-title="{{ $vacancyTitle }}"
                                        data-vacancy-experience="{{ $vacancyExp }}"
                                        data-vacancy-schedule="{{ $vacancyWorkTime }}"
                                        data-vacancy-salary="{{ $vacancyPay }}"
                                    >
                                        <div class="vacancy-card__body">
                                            <div class="vacancy-card__top">
                                                @if($vacancyTitle)
                                                    <h3 class="vacancy-card__title">
                                                        {{ $vacancyTitle }}
                                                    </h3>
                                                @endif

                                                @if($vacancyExp || $vacancyWorkTime)
                                                    <div class="vacancy-card__meta">
                                                        @if($vacancyExp)
                                                            <div class="vacancy-card__meta-item">
                                                                <span class="vacancy-card__icon vacancy-card__icon--briefcase" aria-hidden="true"></span>
                                                                <span>{{ $vacancyExp }}</span>
                                                            </div>
                                                        @endif

                                                        @if($vacancyWorkTime)
                                                            <div class="vacancy-card__meta-item">
                                                                <span class="vacancy-card__icon vacancy-card__icon--clock" aria-hidden="true"></span>
                                                                <span>{{ $vacancyWorkTime }}</span>
                                                            </div>
                                                        @endif
                                                    </div>
                                                @endif
                                            </div>

                                            <div class="vacancy-card__bottom">
                                                @if($vacancyPay)
                                                    <div class="vacancy-card__salary">
                                                        {{ $vacancyPay }}
                                                    </div>
                                                @endif

                                                <span class="vacancy-card__more" aria-hidden="true">
                                                    <span class="vacancy-card__more-text">Читать полностью</span>
                                                    <span class="vacancy-card__more-icon"></span>
                                                </span>
                                            </div>
                                        </div>

                                        <template class="vacancy-card__modal-content">
                                            {!! $vacancyText !!}
                                        </template>

                                        <button
                                            class="vacancy-card__hitarea"
                                            type="button"
                                            data-modal-id="modalVacancy"
                                            aria-label="Читать полностью: {{ $vacancyTitle }}"
                                        ></button>
                                    </article>
                                @endif
                            @endforeach
                        </div>
                    </div>

                    @if($variant === 'grid-cta')
                        <div class="vacancies__empty">
                            <div class="vacancies__empty-copy">
                                <h3 class="vacancies__empty-title">Не нашли подходящую вакансию?</h3>
                                <div class="vacancies__empty-text">Оставьте свой отклик и мы свяжемся с вами</div>
                            </div>

                            @include(get_view('button'), [
                                'text' => 'Откликнуться',
                                'class' => 'vacancies__empty-button',
                                'modifiers' => ['primary'],
                                'modalId' => 'modalContact',
                                'attrs' => [
                                    'data-modal-title' => $modalTitle,
                                    'data-modal-description' => $modalDescription,
                                ],
                            ])
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </section>

    <div class="modal modal--vacancy" data-modal="modalVacancy" aria-labelledby="modalVacancyTitle" hidden>
        <div class="modal-window">
            <button type="button" class="modal-close" data-modal-close="modalVacancy" aria-label="Закрыть"></button>

            <div class="vacancy-modal">
                <div class="vacancy-modal__main">
                    <h2 class="vacancy-modal__title" id="modalVacancyTitle" data-vacancy-modal-title></h2>

                    <div class="vacancy-modal__details">
                        <div class="vacancy-modal__description" data-vacancy-modal-description></div>
                    </div>
                </div>

                <div class="vacancy-modal__response" aria-label="Откликнуться">
                    <h3 class="vacancy-modal__response-title">Откликнуться</h3>

                    @include(get_view('button'), [
                        'text' => 'Оставить заявку',
                        'class' => 'vacancy-modal__submit',
                        'modifiers' => ['primary'],
                        'modalId' => 'modalContact',
                        'attrs' => [
                            'data-modal-title' => $modalTitle,
                            'data-modal-description' => $modalDescription,
                        ],
                    ])
                </div>
            </div>
        </div>
    </div>
@endif
