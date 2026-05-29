@php
    $section = get_collections_with_meta('contactAssistanceCta', 'contactAssistanceCta', [
        'button_text',
        'button_link',
        'button_second_text',
        'button_second_link',
        'modal_id',
    ]);

    $sectionActive = $section['active'] ?? true;
    $sectionMeta = $section['meta'] ?? [];
    $sectionItems = $section['items'] ?? [];
    $sectionItem = $sectionItems[0] ?? [];

    $sectionTitle = !empty($sectionMeta['title'])
        ? $sectionMeta['title']
        : 'Нужна помощь с&nbsp;выбором?';

    $sectionText = $sectionMeta['description'] ?? '';

    $sectionImage = !empty($sectionMeta['picture'])
        ? $sectionMeta['picture']
        : assets_url() . '/blocks/contact-assistance-cta/assets/background.webp';

    $telephone = get_variable('telephone');
    $telephoneDigits = preg_replace('/\D+/', '', (string) $telephone);

    if (strlen($telephoneDigits) === 11 && $telephoneDigits[0] === '8') {
        $telephoneDigits = '7' . substr($telephoneDigits, 1);
    }

    $telephoneHref = $telephoneDigits ? 'tel:+' . $telephoneDigits : '#';

    $socials = [
        [
            'key' => 'vk',
            'label' => 'ВКонтакте',
            'url' => get_variable('vk_link'),
            'icon' => assets_url() . '/blocks/contact-assistance-cta/assets/icon-vk.svg',
        ],
        [
            'key' => 'max',
            'label' => 'MAX',
            'url' => get_variable('max_link'),
            'icon' => assets_url() . '/blocks/contact-assistance-cta/assets/icon-max.svg',
        ],
    ];

    $visibleSocials = array_values(array_filter($socials, static function (array $social): bool {
        return !empty($social['url']) && $social['url'] !== '#';
    }));

    $buttonTextRaw = $sectionItem['button_text'] ?? get_variable('button_main_text');
    $buttonText = (!empty($buttonTextRaw) && $buttonTextRaw !== '#')
        ? $buttonTextRaw
        : 'Выбрать вариант';

    $buttonLinkRaw = trim((string) ($sectionItem['button_link'] ?? get_variable('button_main_link')));
    $buttonLink = ($buttonLinkRaw !== '' && $buttonLinkRaw !== '#')
        ? $buttonLinkRaw
        : '#catalog';

    $isButtonModalLink = in_array($buttonLink, ['modalContact', '#modalContact'], true);
    $buttonModalId = $isButtonModalLink ? 'modalContact' : '';
    $buttonHref = $isButtonModalLink ? '' : $buttonLink;

    $buttonSecondTextRaw = $sectionItem['button_second_text'] ?? get_variable('button_contact_text');
    $buttonSecondText = (!empty($buttonSecondTextRaw) && $buttonSecondTextRaw !== '#')
        ? $buttonSecondTextRaw
        : 'Получить консультацию';

    $buttonSecondLinkRaw = trim((string) ($sectionItem['button_second_link'] ?? get_variable('button_contact_link')));
    $buttonSecondLink = ($buttonSecondLinkRaw !== '' && $buttonSecondLinkRaw !== '#')
        ? $buttonSecondLinkRaw
        : '';

    $modalId = !empty($sectionItem['modal_id'])
        ? $sectionItem['modal_id']
        : 'modalContact';

    $isButtonSecondModalLink = $buttonSecondLink === '' || in_array($buttonSecondLink, ['modalContact', '#modalContact'], true);
    $buttonSecondModalId = $isButtonSecondModalLink ? $modalId : '';
    $buttonSecondHref = $isButtonSecondModalLink ? '' : $buttonSecondLink;
@endphp

@if($sectionActive)
    <section
        class="section section--flush section--curved-top section--curved-bottom contact-assistance-cta"
        id="contact-assistance-cta"
        aria-labelledby="contact-assistance-cta-title"
        data-header-surface="dark"
    >
        <div class="container container--full-bleed">
            <div class="contact-assistance-cta__panel">
                <picture class="contact-assistance-cta__media">
                    <img src="{{ $sectionImage }}" alt="" loading="lazy">
                </picture>

                <div class="contact-assistance-cta__overlay" aria-hidden="true"></div>

                <div class="contact-assistance-cta__content">
                    <div class="contact-assistance-cta__info">
                        <div class="section-header section-header--column">
                            @if($sectionTitle)
                                <h2 class="section-title" id="contact-assistance-cta-title">
                                    {!! $sectionTitle !!}
                                </h2>
                            @endif

                            @if($sectionText)
                                <div class="section-text section-text--inverted">
                                    {!! $sectionText !!}
                                </div>
                            @endif
                        </div>

                        @if($telephone || count($visibleSocials))
                            <div class="contact-assistance-cta__contacts">
                                @if($telephone)
                                    <a class="contact-assistance-cta__phone" href="{{ $telephoneHref }}">
                                        {{ $telephone }}
                                    </a>
                                @endif

                                @if(count($visibleSocials))
                                    <div class="contact-assistance-cta__socials" aria-label="Социальные сети">
                                        @foreach($visibleSocials as $social)
                                            <a
                                                class="social-link social-link--sm social-link--{{ $social['key'] }}"
                                                href="{{ $social['url'] }}"
                                                target="_blank"
                                                rel="nofollow noindex"
                                                aria-label="{{ $social['label'] }}"
                                            >
                                                <img src="{{ $social['icon'] }}" alt="" loading="lazy">
                                            </a>
                                        @endforeach
                                    </div>
                                @endif
                            </div>
                        @endif
                    </div>

                    <div class="contact-assistance-cta__actions">
                        @if($buttonText)
                            @include(get_view('button'), [
                                'text' => $buttonText,
                                'href' => $buttonHref,
                                'modifiers' => ['primary', 'block'],
                                'modalId' => $buttonModalId,
                                'attrs' => [
                                    'data-modal-source' => 'contact-assistance-cta',
                                ],
                            ])
                        @endif

                        @if($buttonSecondText)
                            @include(get_view('button'), [
                                'text' => $buttonSecondText,
                                'href' => $buttonSecondHref,
                                'modifiers' => ['glass-arrow', 'block'],
                                'modalId' => $buttonSecondModalId,
                                'attrs' => [
                                    'data-modal-source' => 'contact-assistance-cta',
                                ],
                            ])
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </section>
@endif
