import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to div structure for accordion */
  const accordion = document.createElement('div');
  accordion.className = 'accordion-wrapper';

  const rows = [...block.children];
  let startIndex = 0;

  // Check if first row is header (title + description)
  if (rows.length > 0 && rows[0].children.length === 2) {
    const firstRow = rows[0];
    const firstCell = firstRow.children[0];
    const secondCell = firstRow.children[1];

    // If first cell is short (likely a title) and second has content, treat as header
    if (firstCell.textContent.length < 100) {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'accordion-header';
      moveInstrumentation(firstRow, headerDiv);

      // Move title content
      const titleDiv = document.createElement('div');
      titleDiv.className = 'accordion-title';
      while (firstCell.firstChild) {
        titleDiv.append(firstCell.firstChild);
      }
      headerDiv.append(titleDiv);

      // Move description content
      const descDiv = document.createElement('div');
      descDiv.className = 'accordion-description';
      while (secondCell.firstChild) {
        descDiv.append(secondCell.firstChild);
      }
      headerDiv.append(descDiv);

      accordion.append(headerDiv);
      startIndex = 1;
    }
  }

  const accordionContent = document.createElement('div');
  accordionContent.className = 'accordion-content';

  rows.slice(startIndex).forEach((row, index) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    moveInstrumentation(row, item);

    const cells = [...row.children];

    if (cells.length >= 2) {
      // Create trigger button
      const trigger = document.createElement('button');
      trigger.className = 'accordion-trigger';
      trigger.id = `accordion-trigger-${index}`;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', `accordion-panel-${index}`);
      moveInstrumentation(cells[0], trigger);

      // Move title content into button
      while (cells[0].firstChild) {
        trigger.append(cells[0].firstChild);
      }

      // Create panel
      const panel = document.createElement('div');
      panel.className = 'accordion-panel';
      panel.id = `accordion-panel-${index}`;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', `accordion-trigger-${index}`);
      panel.style.display = 'none';
      moveInstrumentation(cells[1], panel);

      // Move content into panel
      while (cells[1].firstChild) {
        panel.append(cells[1].firstChild);
      }

      item.append(trigger, panel);

      // Add click handler
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', !isExpanded);
        panel.style.display = isExpanded ? 'none' : 'block';
      });
    }

    accordionContent.append(item);
  });

  accordion.append(accordionContent);
  block.replaceChildren(accordion);
}
