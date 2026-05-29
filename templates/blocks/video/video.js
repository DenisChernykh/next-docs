const ensureLoaded = (video) => {
  if (video.dataset.loading === '1' || video.dataset.loaded === '1') return;

  const sources = video.querySelectorAll('source[data-src]');

  if (!sources.length) return;

  sources.forEach((source) => {
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
  });

  video.dataset.loading = '1';
  video.muted = true;
  video.setAttribute('muted', '');
  video.playsInline = true;
  video.setAttribute('playsinline', '');

  try {
    video.load();
  } catch {}

  const markLoaded = () => {
    video.dataset.loaded = '1';
    video.removeEventListener('loadedmetadata', markLoaded);
  };

  if (video.readyState >= 1) {
    markLoaded();
  } else {
    video.addEventListener('loadedmetadata', markLoaded, { once: true });
  }
};

const playSafely = (video) => {
  const tryPlay = () => video.play().catch(() => {});

  if (video.readyState >= 2) {
    tryPlay();
    return;
  }

  video.addEventListener('canplay', tryPlay, { once: true });
};

const resetVideo = (video) => {
  const doReset = () => {
    try {
      video.currentTime = 0;
      video.pause();
    } catch {}
  };

  if (video.readyState < 1) {
    video.addEventListener('loadedmetadata', doReset, { once: true });
  } else {
    doReset();
  }
};

const hasPlayableSource = (video) =>
  Boolean(
    video.currentSrc ||
      video.querySelector('source[src], source[data-src]') ||
      video.getAttribute('src'),
  );

const startVideoFlow = (video, container) => {
  if (!hasPlayableSource(video)) return;

  container.classList.add('is-started');
  ensureLoaded(video);

  video.muted = false;
  video.removeAttribute('muted');

  window.setTimeout(() => {
    playSafely(video);
    video.controls = true;
  }, 50);
};

export function initVideo(root = document) {
  const scope = root instanceof Element ? root : document;
  const videos = [...scope.querySelectorAll('video[data-lazyvideo]')];

  videos.forEach((video) => {
    if (video.dataset.videoInitialized === '1') return;

    const container = video.closest('[data-lazyvideo-click]');
    const button = container?.querySelector('[data-lazyvideo-button]');

    if (!container) return;

    video.dataset.videoInitialized = '1';

    container.addEventListener('click', (event) => {
      if (container.classList.contains('is-started')) return;

      if (
        event.target instanceof Element &&
        event.target.closest('video') &&
        !event.target.closest('[data-lazyvideo-button]')
      ) {
        return;
      }

      startVideoFlow(video, container);
    });

    button?.addEventListener('click', (event) => {
      event.stopPropagation();

      if (container.classList.contains('is-started')) return;

      startVideoFlow(video, container);
    });
  });

  if (!videos.length || typeof IntersectionObserver === 'undefined') return;

  const anchorToVideo = new WeakMap();
  const isMobile = window.innerWidth <= 768;

  const onEnter = (video) => {
    video._inView = true;
    window.clearTimeout(video._resetTimer);

    const container = video.closest('[data-lazyvideo-click]');

    if (container && !container.classList.contains('is-started')) return;

    ensureLoaded(video);
    video.preload = 'auto';

    const isResetMode = video.getAttribute('data-lazyvideo') === 'reset';

    if (!isResetMode && video.ended && !video.loop) return;

    if (video.getAttribute('data-lazyvideo-autoplay') !== 'false') {
      playSafely(video);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  const onLeave = (video) => {
    video._inView = false;

    if (video.closest('.is-started')) return;

    video.pause();
    video.preload = 'none';

    if (video.getAttribute('data-lazyvideo') !== 'reset') return;

    window.clearTimeout(video._resetTimer);
    video._resetTimer = window.setTimeout(() => {
      if (!video._inView) resetVideo(video);
    }, 1000);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = anchorToVideo.get(entry.target);

        if (!video) return;

        if (entry.isIntersecting) {
          onEnter(video);
        } else {
          onLeave(video);
        }
      });
    },
    {
      rootMargin: isMobile ? '190px 0px' : '400px 0px',
      threshold: 0,
    },
  );

  videos.forEach((video) => {
    const anchor = video.dataset.lazyanchor
      ? document.querySelector(video.dataset.lazyanchor)
      : video;

    if (!anchor) return;

    anchorToVideo.set(anchor, video);
    observer.observe(anchor);
  });
}
