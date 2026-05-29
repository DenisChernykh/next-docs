@php
    $buttonText = isset($text) ? (string) $text : '';
    $buttonHref = isset($href) ? trim((string) $href) : '';
    $hasHref = $buttonHref !== '' && $buttonHref !== '#';
    $buttonType = isset($type) && $type !== '' ? (string) $type : 'button';
    $modalId = isset($modalId) ? trim((string) $modalId) : '';

    $classList = [];
    $customClass = isset($class) ? trim((string) $class) : '';

    if ($customClass !== '') {
        $classList[] = $customClass;
    }

    $classList[] = 'button';
    $modifierList = $modifiers ?? [];

    if (is_string($modifierList)) {
        $modifierList = preg_split('/\s+/', trim($modifierList)) ?: [];
    }

    foreach ((array) $modifierList as $modifier) {
        $modifier = trim((string) $modifier);

        if ($modifier === '') {
            continue;
        }

        if ($modifier === 'has-arrow') {
            $classList[] = 'has-arrow';
            continue;
        }

        $classList[] = str_starts_with($modifier, 'button--')
            ? $modifier
            : 'button--' . $modifier;
    }

    $className = implode(' ', array_unique($classList));
    $isExternal = $hasHref && preg_match('/^https?:\/\//i', $buttonHref);
    $attrList = isset($attrs) && is_array($attrs) ? $attrs : [];

    if (!$hasHref && $modalId !== '') {
        $attrList = ['data-modal-id' => $modalId] + $attrList;
    }
@endphp

@if($hasHref)
    <a
        href="{{ $buttonHref }}"
        class="{{ $className }}"
        @if($isExternal) target="_blank" rel="nofollow noindex" @endif
        @foreach($attrList as $attrName => $attrValue)
            @if($attrValue !== null && $attrValue !== false && $attrValue !== '')
                {{ $attrName }}="{{ $attrValue }}"
            @endif
        @endforeach
    >
        {{ $buttonText }}
    </a>
@else
    <button
        type="{{ $buttonType }}"
        class="{{ $className }}"
        @foreach($attrList as $attrName => $attrValue)
            @if($attrValue !== null && $attrValue !== false && $attrValue !== '')
                {{ $attrName }}="{{ $attrValue }}"
            @endif
        @endforeach
    >
        {{ $buttonText }}
    </button>
@endif
