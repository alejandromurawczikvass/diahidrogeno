import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function getLocalePath(path) {
  const locale = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/i)?.[1];

  if (!locale || path.match(new RegExp(`^/${locale}(?:/|$)`, 'i'))) {
    return path;
  }

  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');

  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  const localizedFooterPath = getLocalePath(footerPath);

  const fragment = await loadFragment(localizedFooterPath) || await loadFragment(footerPath);

  block.textContent = '';

  const footer = document.createElement('div');

  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }

  block.append(footer);
}
