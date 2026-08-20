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

  // Read the authored fields in model order: title, background image, foreground image, date.
  let titleCell = null;
  let backgroundImageCell = null;
  let foregroundImageCell = null;
  let dateCell = null;
  let backgroundImageUrl = null;

  const fields = rows.flatMap((row) => [...row.children]);
  if (fields.length >= 4) {
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

  // Extract background image URL from the authored background image.
  if (backgroundImageCell) {
    const img = backgroundImageCell.querySelector('img');

    if (img) {
      backgroundImageUrl = img.src;
    }
  }

  // Apply background image to hero
  if (backgroundImageUrl) {
    hero.style.backgroundImage = `url('${backgroundImageUrl}')`;
  }

  // Create hero__title
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

  // Create hero__wordmark
  if (foregroundImageCell) {
    const wordmarkDiv = document.createElement('div');
    wordmarkDiv.className = 'hero-wordmark';
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
      // Move any content from cell
      while (foregroundImageCell.firstChild) {
        wordmarkDiv.append(foregroundImageCell.firstChild);
      }
    }

    heroGrid.append(wordmarkDiv);
  }

  // Create hero__date
  if (dateCell) {
    const dateDiv = document.createElement('div');
    dateDiv.className = 'hero-date';
    moveInstrumentation(dateCell, dateDiv);

    const dateP = document.createElement('p');
    dateP.className = 'title-date';
    dateP.textContent = dateCell.textContent.trim();

    dateDiv.append(dateP);
    heroGrid.append(dateDiv);
  }

  containerFull.append(heroGrid);
  heroContent.append(containerFull);
  hero.append(heroContent);

  block.replaceChildren(hero);
}
