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
  let backgroundImageCell = null;
  let foregroundImageCell = null;
  let saveTheDateCell = null;
  let dateCell = null;
  let backgroundImageUrl = null;

  const fields = rows.flatMap((row) => [...row.children]);
  if (fields.length >= 5) {
    [titleCell, backgroundImageCell, foregroundImageCell, saveTheDateCell, dateCell] = fields;
  } else if (fields.length >= 4) {
    [titleCell, backgroundImageCell, foregroundImageCell, dateCell] = fields;
  } else if (fields.length >= 3) {
    [titleCell, backgroundImageCell, dateCell] = fields;
    foregroundImageCell = backgroundImageCell;
  } else if (fields.length >= 2) {
    [titleCell, backgroundImageCell] = fields;
    foregroundImageCell = backgroundImageCell;
  } else if (fields.length === 1) {
    [titleCell] = fields;
  }

  if (backgroundImageCell) {
    const img = backgroundImageCell.querySelector('img');

    if (img) {
      backgroundImageUrl = img.src;
    }
  }

  if (backgroundImageUrl) {
    hero.style.backgroundImage = `url('${backgroundImageUrl}')`;
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
    if (!titleCell?.textContent.trim() && !dateCell?.textContent.trim()) {
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

  if (dateCell && saveTheDateCell) {
    const dateDiv = document.createElement('div');
    dateDiv.className = 'hero-date';
    moveInstrumentation(dateCell, dateDiv);
    moveInstrumentation(saveTheDateCell, dateDiv);

    const saveTheDatep = document.createElement('p')
    const dateP = document.createElement('p');
    dateP.className = 'title-date';
    dateP.className = 'title-save-the-date';
    dateP.textContent = dateCell.textContent.trim();
    saveTheDatep.textContent = dateCell.textContent.trim();

    dateDiv.append(saveTheDatep);
    dateDiv.append(dateP);
    heroGrid.append(dateDiv);
  }

  containerFull.append(heroGrid);
  heroContent.append(containerFull);
  hero.append(heroContent);

  block.replaceChildren(hero);
}
