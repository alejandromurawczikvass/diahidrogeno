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
  iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
  iframe.title = 'Video de YouTube';
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  return iframe;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'grid-fourths';

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    const videoContainer = document.createElement('div');
    const info = document.createElement('div');
    moveInstrumentation(row, item);

    item.className = 'card-video';
    videoContainer.className = 'ratio ratio-16x9 bg-iframe card-video__video';
    info.className = 'card-video__info';
    while (row.firstElementChild) item.append(row.firstElementChild);

    const videoField = item.firstElementChild;
    if (videoField) {
      const video = createYoutubeVideo(videoField.textContent.trim());
      if (video) {
        videoContainer.append(video);
        videoField.remove();
      } else {
        videoField.className = 'anteriores-video-url';
        videoContainer.append(videoField);
      }
    }

    while (item.firstElementChild) info.append(item.firstElementChild);
    item.append(videoContainer, info);
    list.append(item);
  });

  block.replaceChildren(list);
}
