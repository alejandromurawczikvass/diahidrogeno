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
  iframe.width = '426';
  iframe.height = '239';
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

    const videoField = row.children[0];
    if (videoField) {
      const link = videoField.querySelector('a');
      const videoUrl = link ? link.href : videoField.textContent.trim();

      const iframe = createYoutubeVideo(videoUrl);
      if (iframe) {
        videoContainer.append(iframe);
      } else {
        videoContainer.append(videoField.cloneNode(true));
      }
    }

    const titleField = row.children[1];
    if (titleField && titleField.textContent.trim() !== '') {
      infoContainer.append(titleField.cloneNode(true));
    }

    const buttonTextField = row.children[2];
    const buttonLinkField = row.children[3];

    const buttonText = buttonTextField ? buttonTextField.textContent.trim() : '';
    const buttonAnchor = buttonLinkField ? buttonLinkField.querySelector('a') : null;
    let buttonHref;
    if (buttonAnchor) {
      buttonHref = buttonAnchor.href;
    } else if (buttonLinkField) {
      buttonHref = buttonLinkField.textContent.trim();
    } else {
      buttonHref = '';
    }

    if (buttonHref || buttonText) {
      const buttonWrapper = document.createElement('p');
      buttonWrapper.className = 'button-container';

      const a = document.createElement('a');
      a.href = buttonHref || '#';
      a.textContent = buttonText || (buttonAnchor ? buttonAnchor.textContent : 'Ver más');
      a.className = 'button primary';
      a.title = a.textContent;
      a.target = '_blank';

      buttonWrapper.append(a);
      infoContainer.append(buttonWrapper);
    }

    cardVideo.append(videoContainer, infoContainer);
    gridContainer.append(cardVideo);
  });

  block.replaceChildren(gridContainer);
}
