@php
    $section = get_collections_with_meta('alternatingMediaCta', 'alternatingMediaCta', [
        'title',
        'text',
        'images',
        'image_alt',
        'button_show',
        'button_text',
        'button_link',
        'modal_id',
    ]);

    $sectionActive = $section['active'] ?? true;
    $sectionItems = $section['items'] ?? [];

    $buttonTextGlobalRaw = get_variable('button_main_text');
    $buttonTextGlobal = (!empty($buttonTextGlobalRaw) && $buttonTextGlobalRaw !== '#')
        ? $buttonTextGlobalRaw
        : 'Записаться онлайн';

    $buttonLinkGlobalRaw = trim((string) get_variable('button_main_link'));
    $buttonLinkGlobal = ($buttonLinkGlobalRaw !== '' && $buttonLinkGlobalRaw !== '#')
        ? $buttonLinkGlobalRaw
        : '#modalContact';

    $parseImages = static function (mixed $rawImages): array {
        if (is_string($rawImages)) {
            $decodedImages = json_decode($rawImages, true);
            $images = is_array($decodedImages) ? $decodedImages : [$rawImages];
        } elseif (is_array($rawImages)) {
            $images = $rawImages;
        } else {
            $images = [];
        }

        return array_values(array_filter($images, fn ($image) => is_string($image) && trim($image) !== ''));
    };
@endphp

@if($sectionActive && count($sectionItems))
    <section
        class="section alternating-media-cta"
        id="alternating-media-cta"
        aria-label="Индивидуальные CTA-блоки с изображениями"
        data-header-surface="light"
    >
        <div class="container alternating-media-cta__container">
            <div class="alternating-media-cta__list">
                @foreach($sectionItems as $ctaItem)
                    @php
                        $sectionTitle = $ctaItem['title'] ?? '';
                        $sectionText = $ctaItem['text'] ?? '';
                        $sectionImages = $parseImages($ctaItem['images'] ?? []);
                        $sectionImage = $sectionImages[0] ?? '';
                        $sectionImageAlt = $ctaItem['image_alt'] ?? strip_tags($sectionTitle);

                        $buttonShowRaw = $ctaItem['button_show'] ?? true;
                        $buttonShow = in_array($buttonShowRaw, [true, 1, '1', 'true', 'on', 'yes'], true);

                        $buttonTextRaw = $ctaItem['button_text'] ?? '';
                        $buttonText = (!empty($buttonTextRaw) && $buttonTextRaw !== '#')
                            ? $buttonTextRaw
                            : $buttonTextGlobal;

                        $buttonLinkRaw = trim((string) ($ctaItem['button_link'] ?? ''));
                        $buttonLink = ($buttonLinkRaw !== '' && $buttonLinkRaw !== '#')
                            ? $buttonLinkRaw
                            : $buttonLinkGlobal;

                        $modalIdRaw = trim((string) ($ctaItem['modal_id'] ?? ''));
                        $isContactModalLink = in_array($buttonLink, ['modalContact', '#modalContact'], true);
                        $modalId = $modalIdRaw !== ''
                            ? $modalIdRaw
                            : ($isContactModalLink ? 'modalContact' : '');

                        $buttonHref = $isContactModalLink ? '' : $buttonLink;
                    @endphp

                    @if($sectionTitle || $sectionText || $sectionImage)
                        <article class="alternating-media-cta__item{{ $loop->even ? ' alternating-media-cta__item--reverse' : '' }}">
                            <div class="alternating-media-cta__content">
                                <div class="alternating-media-cta__copy">
                                    @if($sectionTitle)
                                        <h2 class="alternating-media-cta__title">
                                            {!! $sectionTitle !!}
                                        </h2>
                                    @endif

                                    @if($sectionText)
                                        <div class="alternating-media-cta__text">
                                            {!! $sectionText !!}
                                        </div>
                                    @endif
                                </div>

                                @if($buttonShow && $buttonText)
                                    @include(get_view('button'), [
                                        'text' => $buttonText,
                                        'href' => $buttonHref,
                                        'modifiers' => ['primary'],
                                        'modalId' => $modalId,
                                        'attrs' => [
                                            'data-modal-source' => 'alternating-media-cta',
                                        ],
                                    ])
                                @endif
                            </div>

                            @if($sectionImage)
                                <div class="alternating-media-cta__media">
                                    <img
                                        src="{{ $sectionImage }}"
                                        alt="{{ $sectionImageAlt }}"
                                        loading="lazy"
                                    >
                                </div>
                            @endif
                        </article>
                    @endif
                @endforeach
            </div>
        </div>
    </section>
@endif
