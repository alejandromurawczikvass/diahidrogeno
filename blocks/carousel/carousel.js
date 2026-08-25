import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function closeModal(dialog) {
  dialog.close();
  dialog.trigger?.focus();
}

function createModal(cards) {
  const dialog = document.createElement('dialog');
  dialog.className = 'carousel-modal';

  const container = document.createElement('div');
  container.className = 'carousel-modal-container';

  const previousButton = document.createElement('button');
  previousButton.className = 'carousel-modal-previous';
  previousButton.type = 'button';
  previousButton.setAttribute('aria-label', 'Previous image');
  const previousIcon = document.createElement('span');
  previousButton.append(previousIcon);

  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-modal-next';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next image');
  const nextIcon = document.createElement('span');
  nextButton.append(nextIcon);

  const slides = document.createElement('div');
  slides.className = 'carousel-modal-slides';

  cards.forEach((card) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-modal-slide';
    slide.append(card.cloneNode(true));
    slides.append(slide);
  });

  let activeIndex = 0;
  const updateSlide = (index) => {
    activeIndex = (index + cards.length) % cards.length;
    slides.querySelectorAll('.carousel-modal-slide').forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeIndex;
    });
  };

  const changeSlide = (amount) => updateSlide(activeIndex + amount);

  previousButton.addEventListener('click', () => changeSlide(-1));
  nextButton.addEventListener('click', () => changeSlide(1));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeModal(dialog);
  });
  dialog.addEventListener('close', () => dialog.trigger?.focus());
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') changeSlide(-1);
    if (event.key === 'ArrowRight') changeSlide(1);
  });

  dialog.openAt = (index, trigger) => {
    dialog.trigger = trigger;
    updateSlide(index);
    if (!dialog.open) dialog.showModal();
  };

  container.append(previousButton, slides, nextButton);
  dialog.append(container);
  updateSlide(0);

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
        div.className = 'carousel-card-image';
      } else {
        const textValue = div.textContent.trim().toLowerCase();
        if (
          textValue.includes('left')
          || textValue.includes('center')
          || textValue.includes('right')
        ) {
          li.classList.add(`align-${textValue}`);
          div.remove();
        }
      }
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  const cards = [...ul.children];
  const dialog = createModal(cards);

  cards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-controls', 'carousel-modal');
    card.addEventListener('click', () => {
      dialog.trigger = card;
      dialog.openAt(index, card);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        dialog.openAt(index, card);
      }
    });
  });

  dialog.id = 'carousel-modal';
  block.replaceChildren(ul);
  block.append(dialog);
}
