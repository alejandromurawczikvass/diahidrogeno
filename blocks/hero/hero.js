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

  // Process rows to extract title, image, and date
  let titleCell = null;
  let imageCell = null;
  let dateCell = null;
  let backgroundImageUrl = null;

  // First row typically has title and image
  if (rows.length > 0) {
    const firstRowCells = [...rows[0].children];
    if (firstRowCells.length >= 1) {
      [titleCell] = firstRowCells;
    }
    if (firstRowCells.length >= 2) {
      [imageCell] = firstRowCells;
    }
  }

  // Second row typically has date
  if (rows.length > 1) {
    const secondRowCells = [...rows[1].children];
    if (secondRowCells.length >= 1) {
      [dateCell] = secondRowCells;
    }
  }

  // Extract background image URL from imageCell
  if (imageCell) {
    const img = imageCell.querySelector('img');

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
  if (imageCell) {
    const wordmarkDiv = document.createElement('div');
    wordmarkDiv.className = 'hero-wordmark';
    moveInstrumentation(imageCell, wordmarkDiv);

    const picture = imageCell.querySelector('picture');
    const img = imageCell.querySelector('img');

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
      while (imageCell.firstChild) {
        wordmarkDiv.append(imageCell.firstChild);
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
