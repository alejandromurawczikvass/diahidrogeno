import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function closeGallery(dialog, trigger) {
  dialog.close();
  trigger?.focus();
}

function createGalleryDialog(images, block) {
  const dialog = document.createElement('dialog');
  dialog.className = 'gallery-modal';
  dialog.setAttribute('aria-label', 'Image gallery');

  const container = document.createElement('div');
  container.className = 'gallery-modal-container';

  const closeButton = document.createElement('button');
  closeButton.className = 'gallery-modal-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close gallery');
  closeButton.textContent = 'x';

  const previousButton = document.createElement('button');
  previousButton.className = 'gallery-modal-previous';
  previousButton.type = 'button';
  previousButton.setAttribute('aria-label', 'Previous image');
  previousButton.textContent = '<';

  const nextButton = document.createElement('button');
  nextButton.className = 'gallery-modal-next';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next image');
  nextButton.textContent = '>';

  const image = document.createElement('img');
  image.className = 'gallery-modal-image';

  const counter = document.createElement('div');
  counter.className = 'gallery-modal-counter';
  counter.setAttribute('aria-live', 'polite');

  const updateImage = (index) => {
    const imageData = images[index];
    image.src = imageData.src;
    image.alt = imageData.alt;
    counter.textContent = `${index + 1} / ${images.length}`;
    dialog.dataset.activeIndex = index;
  };

  const changeImage = (amount) => {
    const currentIndex = Number(dialog.dataset.activeIndex);
    const nextIndex = (currentIndex + amount + images.length) % images.length;
    updateImage(nextIndex);
  };

  closeButton.addEventListener('click', () => closeGallery(dialog, dialog.trigger));
  previousButton.addEventListener('click', () => changeImage(-1));
  nextButton.addEventListener('click', () => changeImage(1));
  dialog.addEventListener('click', (event) => {
    if (!event.target.closest('.gallery-modal-image, button')) {
      closeGallery(dialog, dialog.trigger);
    }
  });
  dialog.addEventListener('close', () => dialog.trigger?.focus());
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') changeImage(-1);
    if (event.key === 'ArrowRight') changeImage(1);
  });

  dialog.openAt = (index, trigger) => {
    dialog.trigger = trigger;
    updateImage(index);
    if (!dialog.open) dialog.showModal();
  };

  container.append(closeButton, previousButton, image, nextButton, counter);
  dialog.append(container);
  block.append(dialog);
  updateImage(0);

  return dialog;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  const images = [];

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    moveInstrumentation(row, item);
    const picture = row.querySelector('picture');
    const image = row.querySelector('img');
    const imageReference = row.querySelector('a[href]');
    if (!image && !imageReference) return;

    const sourceImage = image || document.createElement('img');
    if (!image) {
      sourceImage.src = imageReference.href;
      sourceImage.alt = imageReference.textContent.trim() || 'Gallery image';
    }

    if (picture) {
      const optimizedPicture = createOptimizedPicture(
        sourceImage.src,
        sourceImage.alt || 'Gallery image',
        false,
        [{ width: '1200' }],
      );
      moveInstrumentation(sourceImage, optimizedPicture.querySelector('img'));
      item.append(optimizedPicture);
    } else {
      item.append(sourceImage);
    }

    const renderedImage = item.querySelector('img');
    images.push({
      src: renderedImage.src,
      alt: renderedImage.alt,
    });
    item.dataset.galleryIndex = images.length - 1;
    list.append(item);
  });

  const dialog = images.length ? createGalleryDialog(images, block) : null;
  list.querySelectorAll('li').forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Open image ${Number(item.dataset.galleryIndex) + 1}`);
    const openGallery = () => {
      dialog?.openAt(Number(item.dataset.galleryIndex), item);
    };
    item.addEventListener('click', openGallery);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openGallery();
      }
    });
  });

  block.replaceChildren(list);
  if (dialog) block.append(dialog);
}
