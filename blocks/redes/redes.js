import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const linkElement = row.querySelector('a');
    const href = linkElement ? linkElement.getAttribute('href') : null;

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div, index) => {
      if (index === 0 && div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'red-image';
      } else if (index === 2) {
        div.className = 'red-description';
      } else {
        div.remove();
      }
    });

    const imageContainer = li.querySelector('.red-image');
    const picture = imageContainer?.querySelector('picture');

    if (picture && href) {
      const link = document.createElement('a');
      link.href = href;
      link.className = 'red-image-link';
      if (linkElement.target) link.target = linkElement.target;

      link.append(picture);
      imageContainer.append(link);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}
