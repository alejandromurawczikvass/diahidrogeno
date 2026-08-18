import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to div structure for accordion */
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
      let contentCell = null;

      // Handle different cell configurations
      if (cells.length === 3) {
        // Time | Title | Content
        timeContent = cells[0];
        titleContent = cells[1];
        contentCell = cells[2];
      } else if (cells.length === 2) {
        // Time | Title+Content or just Title | Content
        // Check if first cell looks like time (short, no complex elements)
        if (cells[0].textContent.length < 10) {
          timeContent = cells[0];
          titleContent = cells[1];
        } else {
          // No separate time, use title/content structure
          titleContent = cells[0];
          contentCell = cells[1];
        }
      }

      // Create time badge
      let timeBadge = null;
      if (timeContent) {
        timeBadge = document.createElement('div');
        timeBadge.className = 'accordion-time';
        moveInstrumentation(timeContent, timeBadge);
        while (timeContent.firstChild) {
          timeBadge.append(timeContent.firstChild);
        }
      }

      // Create trigger button with title
      const trigger = document.createElement('button');
      trigger.className = 'accordion-trigger';
      trigger.id = `accordion-trigger-${index}`;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', `accordion-panel-${index}`);
      moveInstrumentation(titleContent, trigger);

      // Move title content into button
      while (titleContent.firstChild) {
        trigger.append(titleContent.firstChild);
      }

      // Create panel
      const panel = document.createElement('div');
      panel.className = 'accordion-panel';
      panel.id = `accordion-panel-${index}`;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', `accordion-trigger-${index}`);
      panel.style.display = 'none';

      // Check if there's content to expand
      const hasContent = contentCell && contentCell.textContent.trim().length > 0;

      if (contentCell && hasContent) {
        moveInstrumentation(contentCell, panel);
        while (contentCell.firstChild) {
          panel.append(contentCell.firstChild);
        }
        // Add class to show arrow only if there's content
        trigger.classList.add('has-content');
      }

      // Build timeline item structure
      const itemContent = document.createElement('div');
      itemContent.className = 'accordion-item-content';

      if (timeBadge) {
        item.append(timeBadge);
      }

      itemContent.append(trigger, panel);
      item.append(itemContent);

      // Add click handler only if there's content
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
