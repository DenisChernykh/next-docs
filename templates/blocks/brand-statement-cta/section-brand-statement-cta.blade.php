@php
    $section = get_collections_with_meta('brandStatementCta', 'brandStatementCta', [
        'logo',
        'button_text',
        'button_link',
        'modal_id',
    ]);

    $sectionActive = $section['active'] ?? true;
    $sectionMeta = $section['meta'] ?? [];
    $sectionItems = $section['items'] ?? [];
    $sectionItem = $sectionItems[0] ?? [];

    $sectionTitle = !empty($sectionMeta['title'])
        ? $sectionMeta['title']
        : 'Мы&nbsp;создаём новый стандарт ухода за&nbsp;автомобилем';

    $sectionText = !empty($sectionMeta['description'])
        ? $sectionMeta['description']
        : 'Сомневаетесь в&nbsp;результате? Приезжайте к&nbsp;нам в&nbsp;студию. Мы&nbsp;бесплатно отполируем небольшой участок вашего авто, чтобы вы&nbsp;увидели разницу своими глазами.';

    $siteName = get_variable('site_name') ?: get_variable('name') ?: 'ГРАНЬ';

    $logoRaw = $sectionItem['logo'] ?? get_variable('logo');
    $logo = (!empty($logoRaw) && $logoRaw !== '#')
        ? $logoRaw
        : assets_url() . '/blocks/brand-statement-cta/assets/logo-compact.svg';

    $buttonTextRaw = $sectionItem['button_text'] ?? get_variable('button_main_text');
    $buttonText = (!empty($buttonTextRaw) && $buttonTextRaw !== '#')
        ? $buttonTextRaw
        : 'Записаться онлайн';

    $buttonLinkRaw = trim((string)($sectionItem['button_link'] ?? get_variable('button_main_link')));
    $buttonLink = ($buttonLinkRaw !== '' && $buttonLinkRaw !== '#')
        ? $buttonLinkRaw
        : '#modalContact';

    $modalIdRaw = trim((string)($sectionItem['modal_id'] ?? ''));
    $isContactModalLink = in_array($buttonLink, ['modalContact', '#modalContact'], true);
    $modalId = $modalIdRaw !== ''
        ? $modalIdRaw
        : ($isContactModalLink ? 'modalContact' : '');

    $buttonHref = $isContactModalLink ? '#' : $buttonLink;
@endphp

@if($sectionActive)
    <section
        class="section brand-statement-cta"
        id="brand-statement-cta"
        aria-labelledby="brand-statement-cta-title"
        data-header-surface="light"
    >
        <div class="container">
            <div class="brand-statement-cta__inner">
                @if($logo)
                    <img
                        class="brand-statement-cta__logo"
                        src="{{ $logo }}"
                        alt="{{ $siteName }}"
                        loading="lazy"
                    >
                @endif

                <div class="section-header section-header--column">
                    @if($sectionTitle)
                        <h2 class="section-title" id="brand-statement-cta-title">
                            {!! $sectionTitle !!}
                        </h2>
                    @endif

                    @if($sectionText)
                        <div class="section-text">
                            {!! $sectionText !!}
                        </div>
                    @endif
                </div>

                @if($buttonText)
                    @include(get_view('button'), [
                        'text' => $buttonText,
                        'href' => $buttonHref,
                        'class' => 'brand-statement-cta__button',
                        'modifiers' => ['primary'],
                        'modalId' => $modalId,
                        'attrs' => [
                            'data-modal-source' => 'brand-statement-cta',
                        ],
                    ])
                @endif
            </div>
        </div>
    </section>
@endif
