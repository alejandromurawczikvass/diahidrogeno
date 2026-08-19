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
  list.className = 'anteriores-list';

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    moveInstrumentation(row, item);

    while (row.firstElementChild) item.append(row.firstElementChild);

    const videoField = item.firstElementChild;
    if (videoField) {
      const video = createYoutubeVideo(videoField.textContent.trim());
      if (video) {
        videoField.replaceWith(video);
        video.className = 'anteriores-video';
      } else {
        videoField.className = 'anteriores-video-url';
      }
    }

    list.append(item);
  });

  block.replaceChildren(list);
}
