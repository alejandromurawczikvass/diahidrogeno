import { moveInstrumentation } from '../../scripts/scripts.js';

function getYoutubeVideoId(value) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
      return url.pathname.slice(1).split('/')[0];
    }

    if (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'm.youtube.com') {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2];
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2];
    }
  } catch {
    return null;
  }

  return null;
}

function createYoutubeVideo(value) {
  const videoId = getYoutubeVideoId(value);
  if (!videoId) return null;

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
  iframe.title = 'Video de YouTube';
  iframe.width = '560';
  iframe.height = '315';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  return iframe;
}

export default function decorate(block) {
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid-fourths';

  [...block.children].forEach((row) => {
    const cardVideo = document.createElement('div');
    const videoContainer = document.createElement('div');
    const infoContainer = document.createElement('div');

    moveInstrumentation(row, cardVideo);

    cardVideo.className = 'card-video';
    videoContainer.className = 'ratio ratio-16x9 bg-iframe card-video__video';
    infoContainer.className = 'card-video__info';

    const videoField = row.firstElementChild;
    if (videoField) {
      const link = videoField.querySelector('a');
      const videoUrl = link ? link.href : videoField.textContent.trim();

      const iframe = createYoutubeVideo(videoUrl);
      if (iframe) {
        videoContainer.append(iframe);
      } else {
        videoContainer.append(videoField.cloneNode(true));
      }
      videoField.remove();
    }

    while (row.firstElementChild) {
      infoContainer.append(row.firstElementChild);
    }

    cardVideo.append(videoContainer, infoContainer);
    gridContainer.append(cardVideo);
  });

  block.replaceChildren(gridContainer);
}
