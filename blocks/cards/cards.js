import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function closeModal(dialog, trigger) {
  dialog.close();
  trigger?.focus();
}

function createModal(card, index) {
  const dialog = document.createElement('dialog');
  dialog.className = 'cards-modal';
  dialog.id = `cards-modal-${index}`;

  const container = document.createElement('div');
  container.className = 'cards-modal-container';

  const closeButton = document.createElement('button');
  closeButton.className = 'cards-modal-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.textContent = 'x';

  const content = document.createElement('div');
  content.className = 'cards-modal-content';

  const modalCard = document.createElement('div');
  modalCard.className = 'speaker-modal';

  const image = card.querySelector('.cards-card-image img');
  if (image) {
    const modalImage = image.cloneNode(true);
    modalImage.className = 'speaker-picture avatars';
    modalCard.append(modalImage);
  }

  const body = card.querySelector('.cards-card-body');
  if (body) {
    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = body.querySelector('p')?.textContent.trim() || '';
    modalCard.append(title);

    const details = document.createElement('div');
    details.className = 'speaker-details';
    [...body.children].slice(1).forEach((child) => details.append(child.cloneNode(true)));
    modalCard.append(details);
  }

  const description = card.querySelector('.cards-card-description');
  if (description) {
    const modalDescription = document.createElement('div');
    modalDescription.className = 'speaker-description';
    while (description.firstChild) modalDescription.append(description.firstChild);
    modalCard.append(modalDescription);
  }

  const links = document.createElement('div');
  links.className = 'speaker-links card';
  modalCard.append(links);

  content.append(modalCard);
  container.append(closeButton, content);
  dialog.append(container);

  closeButton.addEventListener('click', () => closeModal(dialog, dialog.trigger));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeModal(dialog, dialog.trigger);
  });

  return dialog;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div, index) => {
      if (index === 0 && div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (index === 2) {
        div.className = 'cards-card-description';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  const dialogs = [...ul.children].map((card, index) => {
    const dialog = createModal(card, index);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-controls', dialog.id);
    card.addEventListener('click', () => {
      dialog.trigger = card;
      dialog.showModal();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        dialog.trigger = card;
        dialog.showModal();
      }
    });
    return dialog;
  });

  block.replaceChildren(ul);
  block.append(...dialogs);
}
