import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const hero = document.createElement('div');
  hero.className = 'hero hero-home';

  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  const containerFull = document.createElement('div');
  containerFull.className = 'container-full';

  const heroGrid = document.createElement('div');
  heroGrid.className = 'hero-grid';

  const rows = [...block.children];

  let titleCell = null;
  let foregroundImageCell = null;
  let saveTheDateCell = null;
  let dateCell = null;

  const fields = rows.flatMap((row) => [...row.children]);
  if (fields.length >= 4) {
    [titleCell, foregroundImageCell, saveTheDateCell, dateCell] = fields;
  } else if (fields.length >= 3) {
    [titleCell, foregroundImageCell, dateCell] = fields;
  } else if (fields.length >= 2) {
    [titleCell, foregroundImageCell] = fields;
  } else if (fields.length === 1) {
    [titleCell] = fields;
  }

  if (titleCell) {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'hero-title';
    moveInstrumentation(titleCell, titleDiv);

    const titleP = document.createElement('p');
    titleP.className = 'title-hastag';
    titleP.textContent = titleCell.textContent.trim();

    titleDiv.append(titleP);
    heroGrid.append(titleDiv);
  }

  if (foregroundImageCell) {
    const wordmarkDiv = document.createElement('div');
    wordmarkDiv.className = 'hero-wordmark';
    const hasTitle = titleCell?.textContent.trim();
    const hasSaveTheDate = saveTheDateCell?.textContent.trim();
    const hasDate = dateCell?.textContent.trim();
    if (!hasTitle && !hasSaveTheDate && !hasDate) {
      document.querySelector('.section.hero-container').classList.add('only-img');
    }
    moveInstrumentation(foregroundImageCell, wordmarkDiv);

    const picture = foregroundImageCell.querySelector('picture');
    const img = foregroundImageCell.querySelector('img');

    if (picture) {
      const optimizedPic = createOptimizedPicture(
        img.src,
        img.alt || 'Wordmark',
        false,
        [{ width: '1000' }],
      );
      optimizedPic.querySelector('img').className = 'img-wordmark';
      wordmarkDiv.append(optimizedPic);
    } else if (img) {
      img.className = 'img-wordmark';
      wordmarkDiv.append(img);
    } else {
      while (foregroundImageCell.firstChild) {
        wordmarkDiv.append(foregroundImageCell.firstChild);
      }
    }

    heroGrid.append(wordmarkDiv);
  }

  if (saveTheDateCell || dateCell) {
    const dateDiv = document.createElement('div');
    dateDiv.className = 'hero-date';

    if (saveTheDateCell) {
      const saveTheDateP = document.createElement('p');
      saveTheDateP.className = 'title-save-the-date';
      saveTheDateP.textContent = saveTheDateCell.textContent.trim();
      moveInstrumentation(saveTheDateCell, saveTheDateP);
      dateDiv.append(saveTheDateP);
    }

    if (dateCell) {
      const dateP = document.createElement('p');
      dateP.className = 'title-date';
      dateP.textContent = dateCell.textContent.trim();
      moveInstrumentation(dateCell, dateP);
      dateDiv.append(dateP);
    }

    heroGrid.append(dateDiv);
  }

  containerFull.append(heroGrid);
  heroContent.append(containerFull);
  hero.append(heroContent);

  block.replaceChildren(hero);
}
