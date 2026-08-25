import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const accordion = document.createElement('div');
  accordion.className = 'accordion-wrapper';

  const rows = [...block.children];

  const accordionContent = document.createElement('div');
  accordionContent.className = 'accordion-content';

  rows.forEach((row, index) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    moveInstrumentation(row, item);

    const cells = [...row.children];

    if (cells.length >= 2) {
      let timeContent = null;
      let titleContent = null;
      let descriptionContent = null;
      let contentCell = null;

      if (cells.length === 4) {
        [timeContent, titleContent, descriptionContent, contentCell] = cells;
      } else if (cells.length === 3) {
        [timeContent, titleContent] = cells;

        const [, , thirdCell] = cells;
        const thirdCellText = thirdCell.textContent.trim();

        if (thirdCellText.length < 200 && thirdCell.children.length <= 2) {
          descriptionContent = thirdCell;
        } else {
          contentCell = thirdCell;
        }
      } else if (cells.length === 2) {
        const [firstCell, secondCell] = cells;

        if (firstCell.textContent.length < 10) {
          timeContent = firstCell;
          titleContent = secondCell;
        } else {
          titleContent = firstCell;
          contentCell = secondCell;
        }
      }

      let timeBadge = null;
      if (timeContent) {
        timeBadge = document.createElement('div');
        timeBadge.className = 'accordion-time';
        moveInstrumentation(timeContent, timeBadge);
        while (timeContent.firstChild) {
          timeBadge.append(timeContent.firstChild);
        }
      }

      const trigger = document.createElement('button');
      trigger.className = 'accordion-trigger';
      trigger.id = `accordion-trigger-${index}`;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', `accordion-panel-${index}`);
      moveInstrumentation(titleContent, trigger);

      while (titleContent.firstChild) {
        trigger.append(titleContent.firstChild);
      }

      let description = null;
      if (descriptionContent && descriptionContent.textContent.trim().length > 0) {
        description = document.createElement('div');
        description.className = 'accordion-description';
        moveInstrumentation(descriptionContent, description);
        while (descriptionContent.firstChild) {
          description.append(descriptionContent.firstChild);
        }
      }

      const panel = document.createElement('div');
      panel.className = 'accordion-panel';
      panel.id = `accordion-panel-${index}`;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', `accordion-trigger-${index}`);
      panel.style.display = 'none';

      const hasContent = contentCell && contentCell.textContent.trim().length > 0;
      const hasDescription = description !== null;

      if (contentCell && hasContent) {
        moveInstrumentation(contentCell, panel);
        while (contentCell.firstChild) {
          panel.append(contentCell.firstChild);
        }
        trigger.classList.add('has-content');
      }

      const itemContent = document.createElement('div');
      itemContent.className = 'accordion-item-content';

      if (timeBadge) {
        item.append(timeBadge);
      }

      const titleSection = document.createElement('div');
      titleSection.className = 'accordion-title-section';
      titleSection.append(trigger);
      if (hasDescription) {
        titleSection.append(description);
      }

      itemContent.append(titleSection, panel);
      item.append(itemContent);

      if (hasContent) {
        trigger.addEventListener('click', () => {
          const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', !isExpanded);
          panel.style.display = isExpanded ? 'none' : 'block';
        });
      }
    }

    accordionContent.append(item);
  });

  accordion.append(accordionContent);
  block.replaceChildren(accordion);
}
