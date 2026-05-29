@php
    $buttonText = isset($text) ? (string) $text : 'Смотреть';
    $buttonType = isset($type) && $type !== '' ? (string) $type : 'button';
    $classList = ['video-play-button'];
    $customClass = isset($class) ? trim((string) $class) : '';

    if ($customClass !== '') {
        array_unshift($classList, $customClass);
    }

    $className = implode(' ', array_unique($classList));
    $attrList = isset($attrs) && is_array($attrs) ? $attrs : [];
@endphp

<button
    type="{{ $buttonType }}"
    class="{{ $className }}"
    @foreach($attrList as $attrName => $attrValue)
        @if($attrValue === true)
            {{ $attrName }}
        @elseif($attrValue !== null && $attrValue !== false && $attrValue !== '')
            {{ $attrName }}="{{ $attrValue }}"
        @endif
    @endforeach
>
    <span class="video-play-button__text">{{ $buttonText }}</span>
    <span class="video-play-button__icon" aria-hidden="true"></span>
</button>
