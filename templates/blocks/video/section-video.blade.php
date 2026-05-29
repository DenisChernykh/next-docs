@php
    $section = get_collections_with_meta('video', 'video', [
        'video',
        'preview',
        'button_text',
        'image_alt',
    ]);

    $sectionActive = $section['active'] ?? true;
    $sectionMeta = $section['meta'] ?? [];
    $sectionItems = $section['items'] ?? [];
    $sectionItem = $sectionItems[0] ?? [];

    $sectionTitle = !empty($sectionMeta['title'])
        ? $sectionMeta['title']
        : 'Детейлинг в&nbsp;деталях: как мы работаем';

    $sectionText = !empty($sectionMeta['description'])
        ? $sectionMeta['description']
        : 'Загляните за&nbsp;кулисы. Показываем наши стандарты, оборудование лаборатории и&nbsp;реальный процесс защиты премиальных автомобилей.';

    $previewRaw = trim((string) ($sectionItem['preview'] ?? ''));
    $preview = ($previewRaw !== '' && $previewRaw !== '#')
        ? $previewRaw
        : assets_url() . '/blocks/video/assets/poster.png';

    $video = trim((string) ($sectionItem['video'] ?? ''));
    $buttonTextRaw = $sectionItem['button_text'] ?? '';
    $buttonText = (!empty($buttonTextRaw) && $buttonTextRaw !== '#')
        ? $buttonTextRaw
        : 'Смотреть';

    $imageAltRaw = trim((string) ($sectionItem['image_alt'] ?? ''));
    $imageAlt = $imageAltRaw !== ''
        ? $imageAltRaw
        : strip_tags($sectionTitle);

    $videoType = 'video/mp4';

    if (preg_match('/\.webm(\?|$)/i', $video)) {
        $videoType = 'video/webm';
    } elseif (preg_match('/\.(ogg|ogv)(\?|$)/i', $video)) {
        $videoType = 'video/ogg';
    }
@endphp

@if($sectionActive && ($preview || $video))
    <section
        class="section video"
        id="video"
        aria-labelledby="video-title"
        data-header-surface="light"
        data-video
    >
        <div class="container">
            <div class="video__inner">
                <div class="section-header section-header--column">
                    @if($sectionTitle)
                        <h2 class="section-title" id="video-title">
                            {!! $sectionTitle !!}
                        </h2>
                    @endif

                    @if($sectionText)
                        <div class="section-text">
                            {!! $sectionText !!}
                        </div>
                    @endif
                </div>

                <div class="video__media-wrap" data-lazyvideo-click>
                    <video
                        class="video__media"
                        poster="{{ $preview }}"
                        preload="metadata"
                        playsinline
                        data-lazyvideo="reset"
                        data-lazyvideo-autoplay="false"
                        aria-label="{{ $imageAlt }}"
                    >
                        @if($video)
                            <source data-src="{{ $video }}" type="{{ $videoType }}">
                        @endif
                    </video>

                    @if($buttonText)
                        <div class="video__action">
                            @include(get_view('video-play-button'), [
                                'text' => $buttonText,
                                'attrs' => [
                                    'data-lazyvideo-button' => true,
                                ],
                            ])
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </section>
@endif
