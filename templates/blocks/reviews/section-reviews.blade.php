@php
    $sectionRaw = get_collections('reviewsText', 'reviewsText', [
        'tag',
        'title',
        'text',
        'count',
        'total',
        'total_rating',
        'total_reviews',
    ]);

    $sectionMeta = $sectionRaw['meta'] ?? $sectionRaw[0] ?? $sectionRaw ?? [];
    $sectionMeta = is_array($sectionMeta) ? $sectionMeta : [];
    $sectionActive = $sectionRaw['active'] ?? $sectionMeta['active'] ?? true;

    $reviewsData = getPlatformsWithReviews() ?? [];
    $platforms = $reviewsData['ratings'] ?? $reviewsData['platforms'] ?? $reviewsData['links'] ?? [];
    $reviews = $reviewsData['reviews'] ?? $reviewsData['items'] ?? [];

    $readField = static function ($item, array $keys, $fallback = '') {
        if (!is_array($item)) {
            return $fallback;
        }

        foreach ($keys as $key) {
            if (isset($item[$key]) && $item[$key] !== '') {
                return $item[$key];
            }
        }

        return $fallback;
    };

    $normalizePlatformKey = static function ($value) {
        $key = mb_strtolower(trim((string) $value));
        $key = str_replace(['icon-', 'logo-', ' ', '_'], ['', '', '-', '-'], $key);

        $map = [
            '2-gis' => '2gis',
            '2gis' => '2gis',
            'двойгис' => '2gis',
            'yandex' => 'yandex',
            'яндекс' => 'yandex',
            'google' => 'google',
            'гугл' => 'google',
            'otzovik' => 'otzovik',
            'отзовик' => 'otzovik',
            'flamp' => 'flamp',
            'фламп' => 'flamp',
        ];

        $key = $map[$key] ?? $key;
        $key = preg_replace('/[^a-z0-9-]/', '', $key);

        return $key ?: 'platform';
    };

    $normalizeLogoType = static function ($value) {
        $type = mb_strtolower(trim((string) $value));

        return in_array($type, ['black', 'white'], true) ? $type : 'white';
    };

    $sectionTitle = $readField($sectionMeta, ['title'], 'Отзывы наших клиентов');
    $sectionText = $readField($sectionMeta, ['text', 'description'], '');
    $totalRating = $readField($sectionMeta, ['total_rating', 'rating'], $readField($reviewsData, ['total_rating'], '4.9'));
    $totalReviews = $readField($sectionMeta, ['total_reviews', 'count'], $readField($reviewsData, ['total_reviews'], '300'));
    $totalLabel = $readField($sectionMeta, ['total'], 'отзывов');

    $longTextLimit = 140;
    $hasReviews = is_array($reviews) && count($reviews);
    $hasPlatforms = is_array($platforms) && count($platforms);
@endphp

@if($sectionActive && ($hasReviews || $hasPlatforms))
    <section
        class="section reviews"
        id="reviews"
        aria-labelledby="reviews-title"
        data-header-surface="light"
        data-reviews
    >
        <div class="container">
            <div class="reviews__layout">
                <div class="reviews__lead">
                    <div class="section-header section-header--split">
                        <div class="section-header__main">
                            <h2 class="section-title" id="reviews-title">
                                {!! $sectionTitle !!}
                            </h2>

                            @if($sectionText)
                                <div class="section-text">
                                    {!! $sectionText !!}
                                </div>
                            @endif
                        </div>

                        <div class="section-header__aside">
                            <div class="reviews-proof" aria-label="Общая оценка">
                                <div class="reviews-rating reviews-rating--inline">
                                    <div class="reviews-stars" aria-label="Оценка {{ $totalRating }} из 5">
                                        @for($star = 1; $star <= 5; $star++)
                                            <span class="reviews-stars__item is-filled" aria-hidden="true"></span>
                                        @endfor
                                    </div>
                                    <span class="reviews-rating__caption">
                                        <strong>более {{ $totalReviews }} честных мнений</strong>
                                        от наших любимых гостей
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    @if($hasPlatforms)
                        <div class="reviews-platforms" aria-label="Площадки с отзывами">
                            @foreach($platforms as $platform)
                                @php
                                    $platformKey = $normalizePlatformKey($readField($platform, ['key', 'slug', 'code', 'image', 'icon', 'name'], 'platform'));
                                    $platformName = $readField($platform, ['name', 'label', 'title'], $platformKey);
                                    $platformRating = $readField($platform, ['rating', 'value'], '');
                                    $platformLink = $readField($platform, ['link', 'url', 'href'], '');
                                    $platformLogoType = $normalizeLogoType($readField($platform, ['logo_type', 'logoType', 'logo_variant', 'logoVariant'], 'white'));
                                    $platformLogoFile = in_array($platformKey, ['2gis', 'yandex', 'google', 'otzovik', 'flamp'], true)
                                        ? 'icon-' . $platformKey . ($platformLogoType === 'black' ? '-black' : '') . '.svg'
                                        : '';
                                @endphp

                                @if($platformLink)
                                    <a
                                        class="reviews-platform reviews-platform--{{ $platformKey }}"
                                        href="{{ $platformLink }}"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        @if($platformLogoFile)
                                            <span class="reviews-platform__logo" aria-hidden="true">
                                                <img
                                                    src="{{ assets_url() }}/images/reviews/{{ $platformLogoFile }}"
                                                    alt=""
                                                    loading="lazy"
                                                >
                                            </span>
                                        @else
                                            <span class="reviews-platform__logo" aria-hidden="true"></span>
                                        @endif
                                        <span class="reviews-platform__name">{{ $platformName }}</span>
                                        @if($platformRating)
                                            <span class="reviews-platform__rating">{{ $platformRating }}</span>
                                        @endif
                                    </a>
                                @else
                                    <span class="reviews-platform reviews-platform--{{ $platformKey }}">
                                        @if($platformLogoFile)
                                            <span class="reviews-platform__logo" aria-hidden="true">
                                                <img
                                                    src="{{ assets_url() }}/images/reviews/{{ $platformLogoFile }}"
                                                    alt=""
                                                    loading="lazy"
                                                >
                                            </span>
                                        @else
                                            <span class="reviews-platform__logo" aria-hidden="true"></span>
                                        @endif
                                        <span class="reviews-platform__name">{{ $platformName }}</span>
                                        @if($platformRating)
                                            <span class="reviews-platform__rating">{{ $platformRating }}</span>
                                        @endif
                                    </span>
                                @endif
                            @endforeach
                        </div>
                    @endif
                </div>

                @if($hasReviews)
                    <div class="reviews__content">
                        <div class="reviews-slider swiper" data-reviews-slider>
                            <div class="reviews-slider__track swiper-wrapper">
                                @foreach($reviews as $review)
                                    @php
                                        $reviewName = $readField($review, ['name', 'author'], 'Гость');
                                        $reviewImage = $readField($review, ['image', 'avatar', 'picture'], '');
                                        $reviewRating = $readField($review, ['rating', 'stars'], '5');
                                        $reviewDate = $readField($review, ['date', 'created_at'], '');
                                        $reviewText = $readField($review, ['text', 'description', 'body'], '');
                                        $plainReviewText = trim(strip_tags($reviewText));
                                        $isLongReview = mb_strlen($plainReviewText) > $longTextLimit;
                                        $previewText = $isLongReview
                                            ? mb_substr($plainReviewText, 0, $longTextLimit) . '...'
                                            : $plainReviewText;
                                        $ratingValue = (float) str_replace(',', '.', $reviewRating);
                                        $filledStars = max(0, min(5, (int) round($ratingValue)));
                                        $initial = mb_strtoupper(mb_substr($reviewName, 0, 1));
                                    @endphp

                                    <article class="reviews-card swiper-slide" data-reviews-card>
                                        <div class="reviews-card__body">
                                            <div class="reviews-card__text">
                                                {{ $previewText }}
                                            </div>

                                            @if($isLongReview)
                                                <button
                                                    class="reviews-card__more"
                                                    type="button"
                                                    data-modal-id="modalReviews"
                                                    data-reviews-modal-open
                                                >
                                                    Читать полностью
                                                </button>
                                            @endif
                                        </div>

                                        <div class="reviews-card__head">
                                            <div class="reviews-card__top">
                                                <div class="reviews-card__avatar" aria-hidden="true">
                                                    @if($reviewImage)
                                                        <img src="{{ $reviewImage }}" alt="" loading="lazy">
                                                    @else
                                                        <span>{{ $initial }}</span>
                                                    @endif
                                                </div>

                                                <div class="reviews-card__author">
                                                    <h3 class="reviews-card__name">{{ $reviewName }}</h3>
                                                </div>
                                            </div>

                                            <div class="reviews-card__meta">
                                                <div class="reviews-card__rating">
                                                    <div class="reviews-stars" aria-label="Оценка {{ $reviewRating }} из 5">
                                                        @for($star = 1; $star <= 5; $star++)
                                                            <span class="reviews-stars__item{{ $star <= $filledStars ? ' is-filled' : '' }}" aria-hidden="true"></span>
                                                        @endfor
                                                    </div>
                                                    <span class="reviews-card__rating-value">{{ $reviewRating }}</span>
                                                </div>

                                                @if($reviewDate)
                                                    <time class="reviews-card__date">{{ $reviewDate }}</time>
                                                @endif
                                            </div>
                                        </div>

                                        @if($isLongReview)
                                            <template data-reviews-modal-template>
                                                <article class="reviews-modal__review">
                                                    <div class="reviews-card__head">
                                                        <div class="reviews-card__top">
                                                            <div class="reviews-card__avatar" aria-hidden="true">
                                                                @if($reviewImage)
                                                                    <img src="{{ $reviewImage }}" alt="" loading="lazy">
                                                                @else
                                                                    <span>{{ $initial }}</span>
                                                                @endif
                                                            </div>

                                                            <div class="reviews-card__author">
                                                                <h3 class="reviews-card__name">{{ $reviewName }}</h3>
                                                            </div>
                                                        </div>

                                                        <div class="reviews-card__meta">
                                                            <div class="reviews-card__rating">
                                                                <div class="reviews-stars" aria-label="Оценка {{ $reviewRating }} из 5">
                                                                    @for($star = 1; $star <= 5; $star++)
                                                                        <span class="reviews-stars__item{{ $star <= $filledStars ? ' is-filled' : '' }}" aria-hidden="true"></span>
                                                                    @endfor
                                                                </div>
                                                                <span class="reviews-card__rating-value">{{ $reviewRating }}</span>
                                                            </div>

                                                            @if($reviewDate)
                                                                <time class="reviews-card__date">{{ $reviewDate }}</time>
                                                            @endif
                                                        </div>
                                                    </div>

                                                    <div class="reviews-modal__text">
                                                        {!! $reviewText !!}
                                                    </div>
                                                </article>
                                            </template>
                                        @endif
                                    </article>
                                @endforeach
                            </div>
                        </div>

                        <div class="reviews-slider__controls" aria-label="Навигация отзывов">
                            <button class="reviews-slider__button reviews-slider__button--prev slider-arrow slider-arrow--prev" type="button" aria-label="Предыдущий отзыв" data-reviews-prev></button>
                            <button class="reviews-slider__button reviews-slider__button--next slider-arrow slider-arrow--next" type="button" aria-label="Следующий отзыв" data-reviews-next></button>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </section>

    <div class="modal modal--reviews" data-modal="modalReviews" aria-labelledby="modalReviewsTitle" hidden>
        <div class="modal-window">
            <button type="button" class="modal-close" data-modal-close="modalReviews" aria-label="Закрыть"></button>

            <div class="reviews-modal">
                <h2 class="reviews-modal__title" id="modalReviewsTitle">Отзыв клиента</h2>
                <div class="reviews-modal__content" data-reviews-modal-content></div>
            </div>
        </div>
    </div>
@endif
